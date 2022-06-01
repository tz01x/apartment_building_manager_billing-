"""logbill URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from django.urls import path, include
from .jwt_auth import urls_path

from django.views.generic import TemplateView
from wkhtmltopdf.views import PDFTemplateView
from datetime import date

nameList=['তারেক সিরাজুল তারেক সিরাজুল','জান্নাতুল মিথিলা ','বেগম সেলিনা','রহিম সিমেন্ট ',
'সামাদ সজিব ','আবু  মিজানুর','নূর রাসেল',
'আমিন মোস্তাফিজুর','তিথি মিমি','মাহমুদ রবিউল','রয়েল মারুফ',
'রানা কালাম'

]*10


def make2d(objs,innerArrCount=3):
    count=len(objs)
    return (objs[i:i+innerArrCount] for i in range(0,count,innerArrCount))
     

class PDF_preview(TemplateView):
    template_name = "my_template.html"
    def get_context_data(self):
        context = super().get_context_data()
        context.update(
            {
                "objs": make2d(nameList)
            }
        )
        return context


class SimpleView(PDFTemplateView):
    template_name = "my_template.html"
    filename = "my_pdf.pdf"
    cmd_options = {
        'margin-top': "2mm",
        'margin-left': "2mm",
        'margin-right': "2mm",
        "footer-center":'[page]/[toPage]',
        "footer-left": date.today().isoformat()
        
        
    }

    def get_context_data(self):
        context = super().get_context_data()
        context.update(
            {
                "objs": make2d(nameList)
            }
        )
        return context

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("core.urls")),
   
    path('pdf/', SimpleView.as_view(), name='pdf'),
    path('pdf/preview', PDF_preview.as_view(), name='pdf'),
   

]+urls_path
#
from django.conf import settings
from django.conf.urls.static import static


if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
