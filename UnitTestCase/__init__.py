# -*- coding: utf-8 -*-
# pytest 遵循標準的 test discovery rules ，幾點要領：
# 檔名必須是符合 test_*.py 或 *_test.py
# 類別名稱必須是 `Test` 開頭
# 函數與類別內的方法都必須要 test_ 做為 prefix
# 只要至少遵守上述 3 個要領， pytest 就可以自動幫你執行所有合乎規定的測試。
# py.test  --junitxml=test.xml