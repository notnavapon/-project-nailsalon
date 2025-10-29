import React from "react";
import { Calendar, List } from "lucide-react";
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

const History = () => {
  const { bookinglist, reload } = useSelector((state) => state.booking);
  console.log(bookinglist);

  // Timer สำหรับ OTP

  // สร้าง time slots ตั้งแต่ 09:00 - 18:00
  const timeSlots = [
    { id: 9, time: "09:00 - 10:00", value: "09:00" },
    { id: 10, time: "10:00 - 11:00", value: "10:00" },
    { id: 11, time: "11:00 - 12:00", value: "11:00" },
    { id: 12, time: "12:00 - 13:00", value: "12:00" },
    { id: 13, time: "13:00 - 14:00", value: "13:00" },
    { id: 14, time: "14:00 - 15:00", value: "14:00" },
    { id: 15, time: "15:00 - 16:00", value: "15:00" },
    { id: 16, time: "16:00 - 17:00", value: "16:00" },
    { id: 17, time: "17:00 - 18:00", value: "17:00" },
  ];

  // จัดรูปแบบวันที่และเวลา
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {}, [reload]);
  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">คิวที่จองแล้ว</h2>
        </div>

        {bookinglist.length > 0 ? (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {bookinglist.map((booking, index) => (
              <div
                key={index}
                className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm"></div>
                    <span className="font-bold text-indigo-900">
                      {
                        timeSlots.find((index) => index.id === booking.slot)
                          .time
                      }
                    </span>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-700 ml-10">
                  <p>
                    <strong>ชื่อ:</strong> {booking.user}
                  </p>
                  <p>
                    <strong>เบอร์:</strong> {booking.number}
                  </p>
                  <p className="text-xs text-gray-500">
                    จองเมื่อ: {formatDateTime(booking.createAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p>ยังไม่มีการจองในวันนี้</p>
          </div>
        )}

        {bookinglist.length > 0 && (
          <div className="mt-4 pt-4 border-t-2 border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">จำนวนที่จองแล้ว:</span>
              <span className="font-bold text-indigo-600">
                {bookinglist.length} / {timeSlots.length} ช่วง
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
