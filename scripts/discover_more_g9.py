import requests
import re
import json

subjects = ["qarabağ", "hazırlıq", "ix"]

def search_textbooks(query):
    # This is a bit manual since we can't use the search page easily without playwright
    # but we can try to find IDs by searching for keywords in common ranges.
    # Actually, let's just use the discovery script logic for a wider range.
    pass

# User provided a search URL for these, I can just use read_url_content on a modified search URL
# if I can figure out the course_id. 
# But let's just check IDs 1-2500 for Grade 9 keywords.
