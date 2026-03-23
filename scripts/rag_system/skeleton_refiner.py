# skeleton_refiner.py
import re
import os
import logging
from typing import Dict, List, Set, Optional

class SkeletonRefiner:
    """
    LOCAL AI: Restores missing Azerbaijani vowels and consonants using a large dictionary
    and fuzzy skeleton matching.
    """
    
    def __init__(self, dict_path: Optional[str] = None):
        self.logger = logging.getLogger(__name__)
        self.vowels = set('aəeioöuüıAƏEİOÖUÜI')
        self.skeleton_map: Dict[str, List[str]] = {}
        self.dictionary: Set[str] = set()
        self.suffixes = ["lar", "lər", "dan", "dən", "nın", "nin", "nun", "nün", "da", "də", "a", "ə", "ı", "i", "u", "ü", "ın", "in", "un", "ün", "la", "lə"]
        
        if not dict_path:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            dict_path = os.path.join(base_dir, "data", "dictionaries", "az_expanded.txt")
            
        self._load_dictionary(dict_path)

    def _get_skeleton(self, word: str) -> str:
        """Removes vowels and lowercases a word to create its skeleton."""
        return "".join([c for c in word.lower() if c not in self.vowels and c.isalpha()])

    def _load_dictionary(self, path: str):
        if not os.path.exists(path):
            self.logger.warning(f"Dictionary not found at {path}.")
            return

        count = 0
        try:
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    word = line.strip().lower()
                    if not word or len(word) < 2: continue
                    self.dictionary.add(word)
                    skeleton = self._get_skeleton(word)
                    if skeleton not in self.skeleton_map: self.skeleton_map[skeleton] = []
                    self.skeleton_map[skeleton].append(word)
                    count += 1
            self.logger.info(f"Loaded {count} words for local refinement.")
        except Exception as e:
            self.logger.error(f"Error loading dictionary: {e}")

    def _get_vowel_harmony(self, word: str) -> str:
        back_vowels = set('aıouAIOU')
        front_vowels = set('əeiöüƏEİÖÜ')
        for c in reversed(word):
            if c in back_vowels: return 'back'
            if c in front_vowels: return 'front'
        return 'front'

    def _restore_suffix(self, base_word: str, corrupted_sfx: str) -> str:
        harmony = self._get_vowel_harmony(base_word)
        sfx_skel = self._get_skeleton(corrupted_sfx)
        back_map = {"lr": "lar", "n": "ın", "dn": "dan", "d": "da", "lrn": "ların", "nn": "nın", "nr": "nar", "ms": "ması"}
        front_map = {"lr": "lər", "n": "in", "dn": "dən", "d": "də", "lrn": "lərin", "nn": "nin", "nr": "nər", "ms": "məsi"}
        mapping = back_map if harmony == 'back' else front_map
        return mapping.get(sfx_skel, corrupted_sfx)

    def refine_word(self, word: str) -> str:
        clean_word = re.sub(r'[^\w]', '', word)
        lower_word = clean_word.lower()
        if not lower_word or lower_word.isdigit() or len(lower_word) <= 1: return word
        if lower_word in self.dictionary: return word

        skeleton = self._get_skeleton(lower_word)
        
        # 1. Direct Match
        if skeleton in self.skeleton_map:
            return self._preserve_formatting(word, min(self.skeleton_map[skeleton], key=len))

        # 2. Suffix Recovery
        for sfx_len in range(1, 6):
            if len(skeleton) > sfx_len:
                base_skel = skeleton[:-sfx_len]
                sfx_skel = skeleton[-sfx_len:]
                if base_skel in self.skeleton_map:
                    base_word = self.skeleton_map[base_skel][0]
                    restored_sfx = self._restore_suffix(base_word, sfx_skel)
                    return self._preserve_formatting(word, base_word + restored_sfx)

        # 3. Fuzzy match (Handling s/ş, c/ç misrecognitions)
        fuzzy_skel = skeleton.replace('s', 'ş').replace('c', 'ç')
        if fuzzy_skel in self.skeleton_map:
            return self._preserve_formatting(word, self.skeleton_map[fuzzy_skel][0])
            
        # 4. Consonant skip match
        if len(skeleton) >= 4:
            for skel in self.skeleton_map:
                if len(skel) == len(skeleton) + 1:
                    it = iter(skel)
                    if all(c in it for c in skeleton):
                        return self._preserve_formatting(word, self.skeleton_map[skel][0])

        return word

    def _preserve_formatting(self, original: str, refined: str) -> str:
        if not original or not refined: return refined
        if original[0].isupper(): refined = refined.capitalize()
        if original.isupper(): refined = refined.upper()
        pre = re.match(r'^[^\w]+', original)
        post = re.search(r'[^\w]+$', original)
        res = refined
        if pre: res = pre.group() + res
        if post: res = res + post.group()
        return res

    def refine_sentence(self, text: str) -> str:
        """
        New Stage B: Process sentences with word-joining/splitting logic.
        """
        # Apply global replacements first
        text = text.replace('w', 'vv').replace('W', 'VV')
        
        # Initial cleanup for common OCR artifacts
        text = re.sub(r'\bAddm\s*\.', 'Addım 1.', text)
        text = re.sub(r'\bstkan\b', 'stəkan', text, flags=re.I)
        
        tokens = text.split()
        if not tokens: return text
        
        refined_tokens = []
        i = 0
        while i < len(tokens):
            current = tokens[i]
            
            # Stage 8: Fix specific 'ü' vs 'ii' misrecognitions (e.g., bədü -> bədii)
            # Handle possible trailing punctuation in tokens
            fixed_by_heuristic = False
            if 'ü' in current:
                # Find words ending in ü (optionally with trailing punctuation)
                match = re.search(r'(\w+)ü([^\w]*)$', current)
                if match:
                    base = match.group(1)
                    punct = match.group(2)
                    candidate = base.lower() + 'ii'
                    if candidate in self.dictionary:
                        current = current[:match.start()] + self._preserve_formatting(base + 'ü', candidate) + punct
                        fixed_by_heuristic = True
            
            if fixed_by_heuristic:
                refined_tokens.append(current)
                i += 1
                continue

            # Strip punctuation for dictionary lookup
            clean_curr = re.sub(r'[^\w]', '', current).lower()
            
            # Try to Merge with next token (e.g., "məlumat", "lar" -> "məlumatlar")
            if i + 1 < len(tokens):
                nxt = tokens[i+1]
                clean_nxt = re.sub(r'[^\w]', '', nxt).lower()
                combined = clean_curr + clean_nxt
                
                if combined in self.dictionary:
                    # Potential merge
                    refined_tokens.append(self._preserve_formatting(current + nxt, combined))
                    i += 2
                    continue
            
            # Try to Split current token if unknown (e.g., "vəbu" -> "və bu")
            if clean_curr not in self.dictionary and len(clean_curr) >= 4:
                split_found = False
                # Yalnız çox yayılmış birləşən kiçik sözlər üçün parçalama
                common_glued = {"və", "bu", "ilə", "isə", "bir"}
                for j in range(2, len(clean_curr) - 1):
                    part1 = clean_curr[:j]
                    part2 = clean_curr[j:]
                    if part1 in self.dictionary and part2 in self.dictionary:
                        if part1 in common_glued or part2 in common_glued:
                            refined_tokens.append(self._preserve_formatting(current[:j], part1))
                            refined_tokens.append(self._preserve_formatting(current[j:], part2))
                            split_found = True
                            break
                if split_found:
                    i += 1
                    continue
            
            # Default: Individual word refinement
            refined_tokens.append(self.refine_word(current))
            i += 1
            
        return " ".join(refined_tokens)

    def refine_text(self, text: str) -> str:
        if not text: return text
        # Physics and Biology specific pattern-based super fixes
        text = text.replace("Ntic", "Nəticə").replace("qnd ", "qənd ")
        text = text.replace("lav ", "əlavə ").replace("brabr", "bərabər")
        
        # Split into blocks (potential sentences/lines)
        blocks = re.split(r'(\n)', text)
        result = []
        for block in blocks:
            if block == '\n':
                result.append(block)
            else:
                result.append(self.refine_sentence(block))
        return "".join(result)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    refiner = SkeletonRefiner()
    # Test merging "məlumat" + "lar"
    test_1 = "Dərslikdəki məlumat lar çox faydalıdır ."
    # Test splitting "vəbu"
    test_2 = "Ona görə vəbu işi görmək lazımdır ."
    # Mixed test
    test_3 = "Addm 1. Stkan larda isti su vardır ."
    
    for t in [test_1, test_2, test_3]:
        print(f"INPUT:  {t}")
        print(f"OUTPUT: {refiner.refine_text(t)}")
        print("-" * 20)
