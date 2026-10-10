#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TestAI.az - Complete Reproducibility Provenance Chain Verifier (Hardened V3.0)
Strictly enforces:
  1. No assert statements (uses explicit RuntimeError).
  2. True physical isolation: 
     - Run 1 outputs exclusively to tmp1_path.
     - Run 2 outputs exclusively to tmp2_path.
     - The default production report is NEVER read or overwritten.
  3. tmp1_path and tmp2_path are compared directly byte-for-byte.
  4. Pre-run and Post-run input integrity verification.
"""

import os
import sys
import json
import hashlib
import tempfile
import subprocess
from typing import Dict, Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def hash_file(filepath: str) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def get_input_hashes() -> Dict[str, str]:
    hashes = {}
    for g in [8, 9, 10, 11]:
        p = os.path.join(BASE_DIR, "data", "grades", f"grade_{g}.json")
        if not os.path.exists(p):
            raise RuntimeError(f"Missing input grade file: {p}")
        hashes[f"grade_{g}.json"] = hash_file(p)
    return hashes

def verify_provenance():
    print("=====================================================================")
    print("KAG HARDENED PROVENANCE & STRICT TMP1/TMP2 ISOLATION VERIFICATION")
    print("=====================================================================\n")

    # Step 1: Pre-run input hashes
    pre_input_hashes = get_input_hashes()
    print("[Step 1] Pre-run input hashes computed:")
    for k, v in pre_input_hashes.items():
        print(f"  - {k}: {v}")

    classifier_script = os.path.join(BASE_DIR, "scripts", "scratch_semantic_scope_fractions.py")
    if not os.path.exists(classifier_script):
        raise RuntimeError(f"Classifier script missing: {classifier_script}")
    script_hash = hash_file(classifier_script)
    print(f"\n[Step 2] Classifier script SHA-256:\n  {script_hash}")

    # Step 3: Create two distinct temp files
    with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f1, \
         tempfile.NamedTemporaryFile(suffix=".json", delete=False) as f2:
        tmp1_path = f1.name
        tmp2_path = f2.name

    try:
        # Step 4: Run 1 strictly to tmp1_path
        print(f"\n[Step 3] Executing Pass 1 strictly to isolated file:\n  {tmp1_path}")
        env1 = os.environ.copy()
        env1["KAG_OUTPUT_OVERRIDE"] = tmp1_path
        res1 = subprocess.run([sys.executable, classifier_script], capture_output=True, text=True, cwd=BASE_DIR, env=env1)
        if res1.returncode != 0:
            raise RuntimeError(f"Pass 1 failed: {res1.stderr}")
        
        if not os.path.exists(tmp1_path) or os.path.getsize(tmp1_path) == 0:
            raise RuntimeError(f"Pass 1 failed to produce non-empty output at {tmp1_path}")
        
        sha_tmp1 = hash_file(tmp1_path)
        print(f"  -> Pass 1 (tmp1) SHA-256: {sha_tmp1}")

        # Step 5: Run 2 strictly to tmp2_path
        print(f"\n[Step 4] Executing Pass 2 strictly to isolated file:\n  {tmp2_path}")
        env2 = os.environ.copy()
        env2["KAG_OUTPUT_OVERRIDE"] = tmp2_path
        res2 = subprocess.run([sys.executable, classifier_script], capture_output=True, text=True, cwd=BASE_DIR, env=env2)
        if res2.returncode != 0:
            raise RuntimeError(f"Pass 2 failed: {res2.stderr}")
        
        if not os.path.exists(tmp2_path) or os.path.getsize(tmp2_path) == 0:
            raise RuntimeError(f"Pass 2 failed to produce non-empty output at {tmp2_path}")

        sha_tmp2 = hash_file(tmp2_path)
        print(f"  -> Pass 2 (tmp2) SHA-256: {sha_tmp2}")

        # Step 6: Post-run input hashes check
        post_input_hashes = get_input_hashes()
        for k, v in pre_input_hashes.items():
            if post_input_hashes[k] != v:
                raise RuntimeError(f"INPUT MUTATION DETECTED! {k} changed during run!")
        print("\n[Step 5] Input integrity verified: Zero input mutations.")

        # Step 7: Compare tmp1 directly to tmp2
        if sha_tmp1 != sha_tmp2:
            raise RuntimeError(f"CRYPTOGRAPHIC DIVERGENCE: tmp1 ({sha_tmp1}) != tmp2 ({sha_tmp2})")
        print("\n[Step 6] STRICT BYTE-FOR-BYTE ISOLATION CONFIRMED: tmp1 === tmp2 (100.00% IDENTITY)")

        certificate = {
            "verified": True,
            "isolation_method": "STRICT_SEPARATE_TEMP_FILES",
            "pre_input_hashes": pre_input_hashes,
            "post_input_hashes": post_input_hashes,
            "classifier_script_sha256": script_hash,
            "tmp1_output_sha256": sha_tmp1,
            "tmp2_output_sha256": sha_tmp2,
            "is_bit_for_bit_identical": (sha_tmp1 == sha_tmp2)
        }

        cert_path = os.path.join(BASE_DIR, "reports", "reproducibility_provenance_record.json")
        with open(cert_path, "w", encoding="utf-8") as f:
            json.dump(certificate, f, ensure_ascii=False, indent=2)
        print(f"\nCertificate saved to {cert_path}")

    finally:
        for p in [tmp1_path, tmp2_path]:
            if os.path.exists(p):
                try:
                    os.remove(p)
                except Exception:
                    pass

    print("=====================================================================")

if __name__ == "__main__":
    verify_provenance()
