import { Button, Loader, Select } from "@mantine/core";

import React, { useEffect, useState } from "react";
import { useStore } from "react-redux";
import { API_BASE_URL } from "../../constant";
import moment from "moment";
import { useGetSlipPreviewMutation } from "../../slice/biller-slices";

class GenerateDate {
  englishMonthToBanglaMap = {
    "january": "জানুয়ারী",
    "february": "ফেব্রুয়ারী",
    "march": "মার্চ",
    "april": "এপ্রিল",
    "may": "মে",
    "june": "জুন",
    "july": "জুলাই",
    "august": "আগস্ট",
    "september": "সেপ্টেম্বর",
    "october": "অক্টোবর",
    "november": "নভেম্বর",
    "december": "ডিসেম্বর",
  };

  engToBanglaNumberMap = {
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


  startingYear = 2022;
  dateObj = {};

  constructor() {
    for (let year = this.startingYear; year < new Date().getFullYear() + 1; year++) {
      for (let i = 0; i < 12; i++) {
        const d = new Date(year, i);
        let month_bn=moment(d).format("MMMM").toLowerCase();
        month_bn=this.englishMonthToBanglaMap[month_bn];
        const year_bn=this.convertEngToBangla(year)
        this.dateObj = {
          ...this.dateObj,
          [moment(d).format("YYYY-MM-DD")]: `${month_bn}, ${year_bn}`,
        };
      }
    }
  }

  getSelectionData() {
    return Object.keys(this.dateObj).map((k) => {
      return { value: k, label: this.dateObj[k] };
    });
  }

  getToday() {
    return moment(new Date()).format("YYYY-MM") + "-01";
  }

   convertEngToBangla(num){

    let num_str=String(num);
    let newStr="";

    for (let i = 0; i < num_str.length; i++) {
       newStr+= this.engToBanglaNumberMap[num_str[i]];
      
    }
    return newStr;
  }

}
const dateObjList = new GenerateDate();

function RenderElectricMeterReadingSlipt() {
  const [pdfPreview, setPdfPreview] = useState("");

  const [getSlipPreview, { isLoading }] = useGetSlipPreviewMutation();

  const store = useStore();
  const [selectedDate, setSelectedDate] = useState(dateObjList.getToday());

  useEffect(() => {
    getSlipPreview(selectedDate).then((data) => {
      if (data.error) return;

      setPdfPreview(data.data["body"]);
    });

  }, [selectedDate]);

  const downloadPDF = () => {
    fetch(API_BASE_URL + `electricity-meter-reading/pdf/?date=${selectedDate}`, {
      headers: {
        Authorization: "jwt " + store.getState().user.access,
      },
    })
      .then(res => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `slip_for_${selectedDate}.pdf`;
        // some browser needs the anchor to be in the doc
        document.body.append(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="my-3 d-flex justify-content-between">
        <div>
          <Select
            clearable
            placeholder="Pick one"
            value={selectedDate}
            data={dateObjList.getSelectionData()}
            onChange={(val)=>{
              setSelectedDate(val)
            }}
          />
        </div>
        <Button
          onClick={() => {
            downloadPDF();
          }}
        >
          Download
        </Button>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          
          dangerouslySetInnerHTML={{ __html: pdfPreview }}
        ></div>
      )}
    </div>
  );
}

export default RenderElectricMeterReadingSlipt;

/**
 * `
 * নাম : masuk       মাস: এপ্রিল
 *
 * এক ইউনিট খরচ =   ৮   টাকা
 *
 *
 *
 * বর্তমান রেডিং    00000 ইউনিট
 *
 * পূর্ববর্তী রেডিং    00000 ইউনিট
 * ব্যবহার         00000 ইউনিট
 * টাকার পরিমাণ    = 0000 টাকা
 * বাড়ি ভাড়া       = 00000 টাকা
 * অতিরিক্ত খরচ     =
 * মোট
 * `
 */


