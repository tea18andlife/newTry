

# 创建项目的方法
django-admin.py startproject myblog
cd 到刚创建的目录下
manage.py startapp love
# 把项目用8000端口打开来
manage.py runserver 8000
# 初始化
schemamigration love --initial 

schemamigration love --auto

schemamigration love --initial
migrate love

schemamigration app --auto
migrate app

Ctrl+alt+R  schemamigration app --auto   migrate app

cd ~/Sites/python/demo_fast

python manage.py schemamigration love --auto
python manage.py migrate love


/Users/babybus/Sites/python/demo_fast/develop.sh

Can add class
Can view class
view_logentry

http://127.0.0.1:8888/count?name=wocao&desc=密码
