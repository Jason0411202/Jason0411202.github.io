import requests
import re
from bs4 import BeautifulSoup
import json
from django.shortcuts import render

# Create your views here.
def login(request):
    return render(request, 'login.html', {})

def home(request):
    account=request.POST['UserAccount']
    passward=request.POST['UserPassword']
    head={ 
        'User-Agent':'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36'
        #User-Agent 為使用者資訊，告知伺服器端訪問者的資訊
    }
    datas={
        'id':account,#輸入自己的帳密
        'password':passward    
    }
    r=requests.post('https://kiki.ccu.edu.tw/~ccmisp06/cgi-bin/Query/Query_grade.php',headers=head,data=datas)#使用post函式取得網頁原始碼並回傳給r物件
    r.encoding = 'utf-8'
    data=list()
    student_information=list()
    systematics_by_semester=list()
    semester_data_course_amount=list()
    semester_data_total_credit=list()
    semester_data_average_score=list()
    if(r.status_code)==200:
        print('Success')
        semester=re.findall(r'本學期共修習 .{1,2} 門課， .{1,2} 學分，平均 .{0,10} 分',r.text)
        for i in semester:
            semester_data=re.findall(r'[0-9]{1,3}',i)
            semester_data_course_amount.append(semester_data[0])
            semester_data_total_credit.append(semester_data[1])
            semester_data_average_score.append(semester_data[2])
        soup = BeautifulSoup(r.text, 'html.parser')#使用beautiful soup 內的功能解析原始碼
        trs=soup.select('tr')
        counter=-1
        semester_counter=0
        course_amount_index=0
        for tr in trs:
            #print(tr)
            if(counter<=0):
                counter+=1
                continue
            td=tr.select('td')
            temp=[0,0,0,0,0,0]
            j=0
            for i in td:
                if(j<6):
                    temp[j]=i.text.strip()
                    j+=1
                if(j==6):
                    data.append(temp.copy())
                    j=0
            semester_counter+=1
            try:
                if (semester_counter==int(semester_data_course_amount[course_amount_index])):
                    student_information.append(data.copy())
                    data.clear()
                    course_amount_index+=1
                    semester_counter=0
                    counter=0
            except:
                break

        #宣告回傳給html的各項變數
        score_Data=list()
        subject_Name_Data=list()
        semester_data_average_score_Data=[0,0,0,0,0,0,0,0]
        for i in student_information:
            data.clear()
            temp.clear()
            for j in i:
                if(j[5].isdigit()):
                    data.append(int(j[5]))
                else:
                    data.append(0)
                temp.append(j[2])
            score_Data.append(data.copy())
            subject_Name_Data.append(temp.copy())

        while len(score_Data)<8:
            score_Data.insert(0,[0])
            subject_Name_Data.insert(0,["No Data"])
        
        
        while len(semester_data_average_score)<8:
            semester_data_average_score.insert(0,0)
        for i in range(8):
            semester_data_average_score_Data[7-i]=int(semester_data_average_score[i])

    else:
        print('Fail,status_code=%d'%r.status_code)

    return render(request, 'home.html', {'score_Data':json.dumps(score_Data),'subject_Name_Data':json.dumps(subject_Name_Data),'semester_data_average_score_Data':json.dumps(semester_data_average_score_Data)})

def Game(request):
    return render(request, 'Game.html', {})
def about(request):
    return render(request, 'about.html', {})
