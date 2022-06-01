from datetime import date

from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.views.generic import TemplateView


from rest_framework import generics,views
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated

from wkhtmltopdf.views import PDFTemplateView

from .models import *
from .serializers import *
from .utils import make2d,generatePdfContext


class FlatList(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer

class FlatDetails(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Flat.objects.all()
    serializer_class = FlatSerializer
    lookup_field='room_id'

def addorRemoveToSublate(request,room_id,addTo=True):
    obj=get_object_or_404(Flat,room_id=room_id)
    sublets=request.data.get('sublate',None)
    if sublets:
        sublateObjs=[get_object_or_404(Flat,room_id=sublate).id for sublate in sublets]

        if addTo:
            obj.sublate.add(*sublateObjs)
        else:
            obj.sublate.remove(*sublateObjs)

        return Response({"data":FlatSerializer(obj).data})
        
    return Response(data={"message": "invalid data"},status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def addSublate(request,room_id):
    return addorRemoveToSublate(request, room_id)

@api_view(['POST'])
def removeSublate(request,room_id):
    return addorRemoveToSublate(request, room_id,False)

class ExtraChargeList(generics.ListAPIView):
    queryset = ExtraCharge.objects.all()
    serializer_class = ExtraChargeSerializer

class ResidentList(generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer

class ResidentDetails(generics.RetrieveAPIView):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    lookup_field="slug"

class ElectricityMeterReadingListAndCreateView(generics.ListCreateAPIView):
    queryset = ElectricityMeterReading.objects.all()
    serializer_class = ElectricityMeterReadingSerializer

class MonthlyPaidMeterReadingList(generics.ListCreateAPIView):
    queryset = MonthlyPaid.objects.all()
    serializer_class = MonthlyPaidMeterReadingSerializer

class ResidentMonthlyPaidLog(generics.ListAPIView):
    
    serializer_class = MonthlyPaidMeterReadingSerializer

    def get_queryset(self):
        obj=get_object_or_404(Resident,slug=self.kwargs.get('slug'))
        qs=MonthlyPaid.objects.filter(resident=obj).order_by('-created')
        return qs




class GenerateSlip(PDFTemplateView):
    template_name = "core/slip-pdf.html"
    filename = "slips.pdf"
    cmd_options = {
        'margin-top': "2mm",
        'margin-left': "2mm",
        'margin-right': "2mm",
        "footer-center":'[page]/[toPage]',
        "footer-left": date.today().isoformat()
    }

    def get_context_data(self):
        context = super().get_context_data()
        context.update(generatePdfContext(self.request))
        return context

class PdfPreview(generics.ListAPIView):
    def get(self,request,*args,**kwargs):
        
        template_name = "core/slip-pdf.html"
        context=generatePdfContext(request)
        html_str=render_to_string(template_name,context=context)
        
        return JsonResponse({'body':html_str}, status=200)

class PdfDownload(generics.ListAPIView):
    def get(self,request,*args,**kwargs):
        
        return GenerateSlip.as_view()(request,*args,**kwargs)




