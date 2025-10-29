import { useEffect, useState } from "react";
import { Calendar, Clock, User, Check, Phone } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { createBook, getBookByDate } from "../store/bookingSlice";

const Booking = () => {
  const dispatch = useDispatch();
  const { bookinglist, reload } = useSelector((state) => state.booking);

  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState({
    date: today,
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedSlot, setSelectedSlot] = useState();
  const [customerName, setCustomerName] = useState("");
  const [booking, setBooking] = useState({
    user: "",
    slot: "",
    numberuser: "",
    date: "",
  });

  const formateDate = (e) => {
    const newFormatDate = e + "T00:00:00Z";
    return newFormatDate;
  };

  const formatDateThai = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return date.toLocaleDateString("th-TH", options);
  };

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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate({ date: newDate });
    const date = formateDate(newDate);
    dispatch(getBookByDate({ date: date }));
  };

  const handleBooking = async () => {
    // สร้าง booking object ใหม่ทันที แทนการใช้ setState
    const newBooking = {
      date: formateDate(selectedDate.date),
      numberuser: phoneNumber,
      slot: selectedSlot,
      user: customerName,
    };

    // ส่งข้อมูลทันที
    const result = await dispatch(createBook(newBooking));

    // เช็คผลลัพธ์และ reload ข้อมูล
    if (createBook.fulfilled.match(result)) {
      dispatch(getBookByDate({ date: formateDate(selectedDate.date) }));

      // รีเซ็ตฟอร์ม
      setCustomerName("");
      setPhoneNumber("");
      setSelectedSlot(null);
    }
  };

  const isSlotBooked = (slotId) => {
    return bookinglist.some((booking) => booking.slot === slotId);
  };

  useEffect(() => {
    dispatch(getBookByDate({ date: formateDate(selectedDate.date) }));
  }, [selectedDate]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">ระบบจองคิว</h1>
        </div>
        {/* select date */}
        <label className="block text-lg font-semibold text-gray-700 mb-3 mt-5">
          เลือกวันที่
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedDate.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-center py-2 px-4 bg-indigo-50 rounded-lg flex-1 mr-2">
            <span className="text-indigo-700 font-medium">
              {formatDateThai(selectedDate.date)}
            </span>
          </div>
        </div>

        {/* Name */}
        <label className="block text-lg font-semibold text-gray-700 mb-3 mt-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            ชื่อผู้จอง
          </div>
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="กรุณากรอกชื่อของคุณ"
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg
    ${customerName.trim() ? "text-gray-700" : "text-gray-300"}
  `}
        />

        {/* number */}
        <label className="block text-lg font-semibold text-gray-700 mb-3 mt-5">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            เบอร์โทรศัพท์
          </div>
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) setPhoneNumber(value);
          }}
          placeholder="0812345678"
          maxLength="10"
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg
    ${phoneNumber.trim() ? "text-gray-700" : "text-gray-300"}
  `}
        />

        {/* slot */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              เลือกช่วงเวลา
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isBooked = isSlotBooked(slot.id);
              const isSelected = selectedSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => !isBooked && setSelectedSlot(slot.id)}
                  disabled={isBooked}
                  className={`
                        p-4 rounded-xl font-medium transition-all duration-200 border-2
                        ${
                          isBooked
                            ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105"
                            : "bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:shadow-md"
                        }
                      `}
                >
                  <div className="flex items-center justify-between">
                    <span>{slot.time}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* summary */}
        {selectedSlot && customerName && phoneNumber.length === 10 && (
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-3">สรุปการจอง</h3>
            <div className="space-y-2 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p>
                <strong>ชื่อ:</strong> {customerName}
              </p>
              <p>
                <strong>เบอร์:</strong> {phoneNumber}
              </p>
              <p>
                <strong>วันที่:</strong> {formatDateThai(selectedDate.date)}
              </p>
              <p>
                <strong>เวลา:</strong>{" "}
                {timeSlots.find((s) => s.id === selectedSlot)?.time}
              </p>
            </div>
          </div>
        )}

        {/* comfirm button */}
        <button
          onClick={handleBooking}
          disabled={
            !selectedSlot || !customerName.trim() || phoneNumber.length !== 10
          }
          className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
                ${
                  selectedSlot &&
                  customerName.trim() &&
                  phoneNumber.length === 10
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
        >
          {selectedSlot && customerName.trim() && phoneNumber.length === 10
            ? "ยืนยันการจอง"
            : "กรุณากรอกข้อมูลให้ครบถ้วน"}
        </button>
      </div>
    </>
  );
};

export default Booking;
