"""myProject URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from quotes import views

urlpatterns = [
    #path(註1,連結views.py函式,與html連結的name)
    path("", views.login),
    #path("", views.home,name='index'),
    path("home", views.home,name="home"),
    path("Game", views.Game,name='Game'),
    path("about", views.about,name='about'),
    path('admin/', admin.site.urls),
]
'''
註1:欲顯示的網站相對於localhost的位置
例如 path("", views.home,name='index') 代表該網站會顯示於http://127.0.0.1:8000/
    path("about", views.about,name='about'),代表該網站會顯示於http://127.0.0.1:8000/about

'''
