from django import template
from datetime import datetime

ENG_TO_BANGLA_NUM_DICT = {
    '0': "০",
    '1': "১",
    '2': "২",
    '3': "৩",
    '4': "৪",
    '5': "৫",
    '6': "৬",
    '7': "৭",
    '8': "৮",
    '9': "৯",
}    

ENG_TO_BANGLA_MONTH_NAME_DIC = {
  'january': "জানুয়ারী",
  'february': "ফেব্রুয়ারী",
  'march': "মার্চ",
  'april': "এপ্রিল",
  'may': "মে",
  'june': "জুন",
  'july': "জুলাই",
  'august': "আগস্ট",
  'september': "সেপ্টেম্বর",
  'october': "অক্টোবর",
  'november': "নভেম্বর",
  'december': "ডিসেম্বর",
}

register = template.Library()


#simle Tag
@register.filter
def mod(num,arg):
	return num%arg==0	

@register.filter
def sub(num,arg):
	return num-arg

@register.filter
def num_eng_to_bn(num):
  if num is None or num == '':
    return ENG_TO_BANGLA_NUM_DICT['0']

  num_str=str(int(num))
  new_str=""
  try:
    
    for c in num_str:
      new_str+=ENG_TO_BANGLA_NUM_DICT[c]
    return new_str
  except Exception as e:
    print(e)
    print("exception for : ",num)
    return "@" 


@register.filter
def date_eng_to_ban(date):
	date_str=""+ENG_TO_BANGLA_MONTH_NAME_DIC[date.strftime('%B').lower()]
	date_str+=" ,"+ num_eng_to_bn(date.strftime('%Y')) 
	return date_str
