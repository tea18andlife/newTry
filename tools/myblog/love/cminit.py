# -*- coding:utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding("utf-8")

import os
import time
import json
import shutil
from datetime import datetime

cur_dir = sys.path[0]

mydata  = os.path.join(cur_dir,'mydata')

TEMP_DIR = os.path.join(cur_dir,'media','temp')

def TryUntilFind(driver, element, findway = 'find_element_by_xpath', findTime = 1):
    time.sleep(0.5)
    if findTime > 100:
        return 'Can\'t find'
    try:
        func = 'driver.%s(element)'%findway
        return eval(func)
    except Exception as e:
        time.sleep(0.5)
        return TryUntilFind(driver, element, findway, findTime + 1)

HPath  = 'http://127.0.0.1:8888/'