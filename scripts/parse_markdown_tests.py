#!/usr/bin/env python3
"""
Markdown Test Artifact Parser
Parses generated markdown test files and converts them to structured JSON
"""

import json
import re
import os
from pathlib import Path
from typing import List, Dict, Any, Optional


class MarkdownTestParser:
    """Parse markdown test files and convert to structured JSON"""

    def __init__(self):
        self.questions: List[Dict[str, Any]] = []
        self.current_subject: str = ""
        self.current_grade: str = ""

    def parse_file(self, file_path: str, subject: str, grade: str) -> List[Dict[str, Any]]:
        """Parse a markdown test file"""
        self.questions = []
        self.current_subject = subject
        self.current_grade = grade

        if not os.path.exists(file_path):
            print(f"⚠️  File not found: {file_path}")
            return []

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            print(f"📖 Parsing {subject} (Grade {grade}) from {os.path.basename(file_path)}")
            self._parse_content(content)
            
            return self.questions
        except Exception as e:
            print(f"❌ Error parsing {file_path}: {str(e)}")
            return []

    def _parse_content(self, content: str):
        """Parse markdown content into questions"""
        # Split by question markers (usually numbered like ## 1., ## 2., etc.)
        question_blocks = re.split(r'(?:^|\n)##\s+\d+\.\s+', content)
        
        for idx, block in enumerate(question_blocks[1:], 1):  # Skip first empty split
            question_data = self._parse_question_block(block, idx)
            if question_data:
                self.questions.append(question_data)

    def _parse_question_block(self, block: str, question_id: int) -> Optional[Dict[str, Any]]:
        """Parse a single question block"""
        lines = block.strip().split('\n')
        if not lines:
            return None

        question_text = lines[0].strip()
        options = []
        correct_answer = None
        explanation = ""
        difficulty = "orta"
        bloom_level = "anlama"

        # Parse options (usually A), B), C), D))
        option_pattern = r'^[A-D]\)\s*(.+)$'
        explanation_started = False
        explanation_lines = []

        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue

            # Check for option
            match = re.match(option_pattern, line)
            if match and len(options) < 4:
                options.append(match.group(1).strip())
            elif line.startswith('**Cavab:**') or line.startswith('Cavab:'):
                # Extract correct answer
                answer_text = line.replace('**Cavab:**', '').replace('Cavab:', '').strip()
                # Map A/B/C/D to 0/1/2/3
                correct_answer = self._get_answer_index(answer_text)
            elif line.startswith('**İzahat:**') or line.startswith('İzahat:'):
                explanation_started = True
                explanation = line.replace('**İzahat:**', '').replace('İzahat:', '').strip()
            elif explanation_started:
                if line and not line.startswith('**'):
                    explanation_lines.append(line)
            elif 'Çətinlik' in line or 'çətinlik' in line:
                if 'sadə' in line.lower():
                    difficulty = 'sadə'
                elif 'çətin' in line.lower():
                    difficulty = 'çətin'
                else:
                    difficulty = 'orta'
            elif 'Bloom' in line:
                if 'bilmə' in line.lower():
                    bloom_level = 'bilmə'
                elif 'anlama' in line.lower():
                    bloom_level = 'anlama'
                elif 'tətbiq' in line.lower():
                    bloom_level = 'tətbiq'
                elif 'təhlil' in line.lower():
                    bloom_level = 'təhlil'
                elif 'qiymətləndirmə' in line.lower():
                    bloom_level = 'qiymətləndirmə'

        if explanation_lines:
            explanation += ' ' + ' '.join(explanation_lines)

        # Validate question
        if not question_text or len(options) < 4 or correct_answer is None:
            print(f"⚠️  Skipping incomplete question {question_id}")
            return None

        return {
            'id': question_id,
            'question': question_text,
            'options': options,
            'correctAnswer': correct_answer,
            'explanation': explanation.strip(),
            'difficulty': difficulty,
            'topic': self._extract_topic(),
            'bloomLevel': bloom_level,
            'timeEstimate': 2,
            'sourceContext': f"{self.current_subject} - Sinif {self.current_grade}"
        }

    def _extract_topic(self) -> str:
        """Extract topic from subject and question"""
        # Map subjects to general topics
        topic_map = {
            'edebiyyat': 'Ədəbi əsərlər',
            'riyaziyyat': 'Riyazi problemlər',
            'english': 'İngilis dili',
            'azerbaycan-dili': 'Azərbaycan dili',
        }
        return topic_map.get(self.current_subject.lower(), self.current_subject)

    def _get_answer_index(self, answer_text: str) -> int:
        """Convert answer letter to index"""
        answer_map = {
            'A': 0, 'B': 1, 'C': 2, 'D': 3,
            'a': 0, 'b': 1, 'c': 2, 'd': 3,
            'A)': 0, 'B)': 1, 'C)': 2, 'D)': 3,
        }
        # Take first character or first two characters
        key = answer_text.strip()[:2] if answer_text else 'B'
        return answer_map.get(key, 1)  # Default to B (index 1)


def main():
    """Main entry point"""
    parser = MarkdownTestParser()
    
    # Define test files to parse
    test_files = [
        {
            'path': '/vercel/share/v0-project/edebiyyat-7-tests.md',
            'subject': 'edebiyyat',
            'grade': '7'
        },
        {
            'path': '/vercel/share/v0-project/riyaziyyat-7-tests-hisse1.md',
            'subject': 'riyaziyyat',
            'grade': '7'
        },
        {
            'path': '/vercel/share/v0-project/riyaziyyat-7-tests-hisse2.md',
            'subject': 'riyaziyyat',
            'grade': '7'
        },
        {
            'path': '/vercel/share/v0-project/azerbaycan-dili-7-tests.md',
            'subject': 'azerbaycan-dili',
            'grade': '7'
        },
        {
            'path': '/vercel/share/v0-project/english-7-tests.md',
            'subject': 'english',
            'grade': '7'
        },
    ]

    # Load existing offline tests
    output_path = '/vercel/share/v0-project/data/offline_tests.json'
    existing_tests = {}
    
    if os.path.exists(output_path):
        with open(output_path, 'r', encoding='utf-8') as f:
            existing_tests = json.load(f)
        print(f"✅ Loaded existing offline tests with {len(existing_tests)} subjects")

    # Parse each test file
    for test_file in test_files:
        if os.path.exists(test_file['path']):
            questions = parser.parse_file(
                test_file['path'],
                test_file['subject'],
                test_file['grade']
            )
            
            if questions:
                # Create subject key
                subject_key = test_file['subject'].replace('-', ' ').title()
                
                # Add or update subject
                if subject_key not in existing_tests:
                    existing_tests[subject_key] = []
                
                existing_tests[subject_key].extend(questions)
                print(f"✅ Added {len(questions)} questions for {subject_key}")
        else:
            print(f"ℹ️  File not found (optional): {test_file['path']}")

    # Save updated offline tests
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(existing_tests, f, ensure_ascii=False, indent=2)
    
    # Print summary
    total_questions = sum(len(questions) for questions in existing_tests.values())
    print(f"\n✅ Successfully saved {total_questions} total questions to {output_path}")
    print(f"📊 Subjects: {', '.join(existing_tests.keys())}")
    
    for subject, questions in existing_tests.items():
        print(f"   - {subject}: {len(questions)} questions")


if __name__ == '__main__':
    main()
