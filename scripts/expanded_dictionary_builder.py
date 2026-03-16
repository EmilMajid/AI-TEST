
import os
import re

class ExpandedDictionaryBuilder:
    def __init__(self, base_dict_path: str, output_path: str):
        self.base_dict_path = base_dict_path
        self.output_path = output_path
        self.vowels = set('aəeioöuüı')
        
        # Azerbaijani Suffix Groups
        # 1. Plural (lar/lər)
        self.plural_suffixes = {'back': 'lar', 'front': 'lər'}
        
        # 2. Case Suffixes (4-way harmony) - Genitive
        self.genitive_suffixes = {
            'a': 'nın', 'ı': 'nın', # back-flat
            'o': 'nun', 'u': 'nun', # back-round
            'e': 'nin', 'ə': 'nin', 'i': 'nin', # front-flat
            'ö': 'nün', 'ü': 'nün'  # front-round
        }
        
        # 3. Case Suffixes (2-way harmony) - Ablative/Locative
        self.ablative_suffixes = {'back': 'dan', 'front': 'dən'}
        self.locative_suffixes = {'back': 'da', 'front': 'də'}
        self.dative_suffixes = {'back': 'a', 'front': 'ə'}
        self.accusative_suffixes = {
            'a': 'nı', 'ı': 'nı',
            'o': 'nu', 'u': 'nu',
            'e': 'ni', 'ə': 'ni', 'i': 'ni',
            'ö': 'nü', 'ü': 'nü'
        }

    def get_harmony_type(self, word: str):
        last_vowel = None
        for char in reversed(word):
            if char in self.vowels:
                last_vowel = char
                break
        
        if not last_vowel:
            return 'front', 'ə'
            
        is_back = last_vowel in 'aıou'
        harmony = 'back' if is_back else 'front'
        return harmony, last_vowel

    def expand_word(self, word: str) -> set:
        word = word.lower().strip()
        if not word or len(word) < 2:
            return set()
            
        expanded = {word}
        harmony, last_vowel = self.get_harmony_type(word)
        
        # Add Plural
        plural = word + self.plural_suffixes[harmony]
        expanded.add(plural)
        
        # Add Genitive
        expanded.add(word + self.genitive_suffixes.get(last_vowel, 'in'))
        
        # Add Ablative
        expanded.add(word + self.ablative_suffixes[harmony])
        
        # Add Locative
        expanded.add(word + self.locative_suffixes[harmony])

        # Add Dative
        # Note: Handling ending vowels for dative (e.g., 'ata' -> 'ataya')
        if word[-1] in self.vowels:
            expanded.add(word + 'ya' if harmony == 'back' else word + 'yə')
        else:
            expanded.add(word + self.dative_suffixes[harmony])
            
        # Add Accusative
        expanded.add(word + self.accusative_suffixes.get(last_vowel, 'i'))

        # Add nested forms (Plural + Genitive/Ablative etc.)
        p_harmony, p_last_vowel = self.get_harmony_type(plural)
        expanded.add(plural + self.genitive_suffixes.get(p_last_vowel, 'in'))
        expanded.add(plural + self.ablative_suffixes[p_harmony])
        
        return expanded

    def build(self):
        if not os.path.exists(self.base_dict_path):
            print(f"Error: Base dictionary not found at {self.base_dict_path}")
            return
            
        print(f"[*] Reading base dictionary: {self.base_dict_path}")
        with open(self.base_dict_path, "r", encoding="utf-8") as f:
            base_words = [line.strip() for line in f if line.strip()]
            
        print(f"[*] Expanding {len(base_words)} words...")
        expanded_pool = set()
        for word in base_words:
            expanded_pool.update(self.expand_word(word))
            
        print(f"[*] Final Dictionary Size: {len(expanded_pool)} words")
        
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        with open(self.output_path, "w", encoding="utf-8") as f:
            for word in sorted(expanded_pool):
                f.write(word + "\n")
        
        print(f"[✓] Expanded dictionary saved to: {self.output_path}")

if __name__ == "__main__":
    import pathlib
    base_dir = pathlib.Path(__file__).parent.parent
    builder = ExpandedDictionaryBuilder(
        str(base_dir / "data" / "dictionaries" / "az.txt"),
        str(base_dir / "data" / "dictionaries" / "az_expanded.txt")
    )
    builder.build()
