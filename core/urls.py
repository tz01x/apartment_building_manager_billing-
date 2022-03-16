from django.urls import path,include
from .views import (FlatList,FlatDetails,addSublate,removeSublate,ExtraChargeList,
                    ResidentList,
                    ElectricityMeterReadingList,
                    MonthlyPaidMeterReadingList)
                    
urlpatterns = [
    path('flat/',FlatList.as_view()),
    path('flat/<str:room_id>/',FlatDetails.as_view()),
    path('flat/<str:room_id>/sublate/add/',addSublate,),
    path('flat/<str:room_id>/sublate/remove/',removeSublate),
    path('extra-charge/',ExtraChargeList.as_view()),
    path('resident/',ResidentList.as_view()),
    path('electricity-meter-reading/',ElectricityMeterReadingList.as_view()),
    path('monthly-paid-meter-reading/',MonthlyPaidMeterReadingList.as_view()),

]
