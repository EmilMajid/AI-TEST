#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

with open('data/grades/grade_11.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for subj in d.keys():
    print(subj)
