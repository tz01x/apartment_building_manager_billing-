from django.urls import path,include
from .views import (FlatList,FlatDetails,addSublate,removeSublate,ExtraChargeList,
                    ResidentList,ResidentDetails,
                    ElectricityMeterReadingListAndCreateView,
                    MonthlyPaidMeterReadingList,
                    ResidentMonthlyPaidLog,
                    PdfDownload,PdfPreview,GenerateSlip
                    )
                    
urlpatterns = [
    path('flat/',FlatList.as_view()),
    path('flat/<str:room_id>/',FlatDetails.as_view()),
    path('flat/<str:room_id>/sublate/add/',addSublate,),
    path('flat/<str:room_id>/sublate/remove/',removeSublate),
    path('extra-charge/',ExtraChargeList.as_view()),
    path('resident/',ResidentList.as_view()),
    path('resident/<str:slug>/',ResidentDetails.as_view()),
    path('electricity-meter-reading/',ElectricityMeterReadingListAndCreateView.as_view()),
    path('electricity-meter-reading/pdf/',PdfDownload.as_view()),
    path('electricity-meter-reading/pdf/preview/',PdfPreview.as_view()),
    path('monthly-paid-meter-reading/',MonthlyPaidMeterReadingList.as_view()),
    path('monthly-paid-log/<str:slug>/',ResidentMonthlyPaidLog.as_view()),

]
