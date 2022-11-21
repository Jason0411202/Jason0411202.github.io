from week10project import views
from django.urls import path

urlpatterns = [
    path('', views.home),
    path('ccu410410054_function', views.ccu410410054_function)
]
