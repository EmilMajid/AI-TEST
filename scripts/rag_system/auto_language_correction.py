from typing import Optional
import logging

try:
    from langdetect import detect
except ImportError:
    detect = None

try:
    import language_tool_python
except ImportError:
    language_tool_python = None

class AutoLanguageCorrector:
    """
    Dili təyin edir və qrammatik düzəlişlər təklif edir.
    """
    def __init__(self, default_lang="az", enable_correction=False):
        self.default_lang = default_lang
        self.enable_correction = enable_correction
        self.logger = logging.getLogger(__name__)

        if language_tool_python and enable_correction:
            try:
                self.tool = language_tool_python.LanguageTool(default_lang)
            except Exception as e:
                self.logger.warning(f"LanguageTool could not be initialized: {e}")
                self.tool = None
        else:
            self.tool = None

    def detect_language(self, text: str) -> str:
        if not detect or not text or len(text) < 10:
            return self.default_lang
        try:
            return detect(text)
        except:
            return self.default_lang

    def correct(self, text: str, lang: Optional[str] = None) -> str:
        if not self.tool or not self.enable_correction:
            return text
        try:
            return self.tool.correct(text)
        except:
            return text
