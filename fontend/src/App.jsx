import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, Phone, Shield, List } from 'lucide-react';

export default function App() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];
  
  const mockBookings = {
    [today]: [
      {
        slotId: 1,
        name: 'สมชาย ใจดี',
        phone: '0812345678',
        time: '09:00 - 10:00',
        bookedAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        slotId: 2,
        name: 'สมหญิง รักสุข',
        phone: '0823456789',
        time: '10:00 - 11:00',
        bookedAt: new Date(Date.now() - 5400000).toISOString()
      },
      {
        slotId: 4,
        name: 'วิชัย มั่นคง',
        phone: '0834567890',
        time: '12:00 - 13:00',
        bookedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        slotId: 6,
        name: 'ประภา สว่างไสว',
        phone: '0845678901',
        time: '14:00 - 15:00',
        bookedAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    [tomorrow]: [
      {
        slotId: 1,
        name: 'อนุชา ศรีสุข',
        phone: '0856789012',
        time: '09:00 - 10:00',
        bookedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        slotId: 3,
        name: 'นภา จันทร์เพ็ญ',
        phone: '0867890123',
        time: '11:00 - 12:00',
        bookedAt: new Date(Date.now() - 82800000).toISOString()
      },
      {
        slotId: 5,
        name: 'สุรชัย วงศ์ใหญ่',
        phone: '0878901234',
        time: '13:00 - 14:00',
        bookedAt: new Date(Date.now() - 79200000).toISOString()
      },
      {
        slotId: 7,
        name: 'มาลี ดอกบัว',
        phone: '0889012345',
        time: '15:00 - 16:00',
        bookedAt: new Date(Date.now() - 75600000).toISOString()
      },
      {
        slotId: 8,
        name: 'ธนา เจริญสุข',
        phone: '0890123456',
        time: '16:00 - 17:00',
        bookedAt: new Date(Date.now() - 72000000).toISOString()
      },
      {
        slotId: 9,
        name: 'ปิยะ สมบูรณ์',
        phone: '0801234567',
        time: '17:00 - 18:00',
        bookedAt: new Date(Date.now() - 68400000).toISOString()
      }
    ],
    [dayAfter]: [
      {
        slotId: 1,
        name: 'กานต์ แสงสว่าง',
        phone: '0912345678',
        time: '09:00 - 10:00',
        bookedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        slotId: 2,
        name: 'พิมพ์ ดารา',
        phone: '0923456789',
        time: '10:00 - 11:00',
        bookedAt: new Date(Date.now() - 169200000).toISOString()
      },
      {
        slotId: 3,
        name: 'ชัยวัฒน์ ทองดี',
        phone: '0934567890',
        time: '11:00 - 12:00',
        bookedAt: new Date(Date.now() - 165600000).toISOString()
      },
      {
        slotId: 4,
        name: 'สุดา เพชรรัตน์',
        phone: '0945678901',
        time: '12:00 - 13:00',
        bookedAt: new Date(Date.now() - 162000000).toISOString()
      },
      {
        slotId: 5,
        name: 'บุญมี ร่มเย็น',
        phone: '0956789012',
        time: '13:00 - 14:00',
        bookedAt: new Date(Date.now() - 158400000).toISOString()
      },
      {
        slotId: 6,
        name: 'วารุณี แก้วกัน',
        phone: '0967890123',
        time: '14:00 - 15:00',
        bookedAt: new Date(Date.now() - 154800000).toISOString()
      },
      {
        slotId: 7,
        name: 'ประสิทธิ์ ชัยชนะ',
        phone: '0978901234',
        time: '15:00 - 16:00',
        bookedAt: new Date(Date.now() - 151200000).toISOString()
      },
      {
        slotId: 8,
        name: 'นิภา สายทอง',
        phone: '0989012345',
        time: '16:00 - 17:00',
        bookedAt: new Date(Date.now() - 147600000).toISOString()
      },
      {
        slotId: 9,
        name: 'เกรียงไกร มั่งมี',
        phone: '0990123456',
        time: '17:00 - 18:00',
        bookedAt: new Date(Date.now() - 144000000).toISOString()
      }
    ]
  };
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(mockBookings);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Timer สำหรับ OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (otpTimer === 0 && otpSent) {
      setOtpSent(false);
      setGeneratedOtp('');
    }
  }, [otpTimer, otpSent]);

  // สร้าง time slots ตั้งแต่ 09:00 - 18:00
  const timeSlots = [
    { id: 1, time: '09:00 - 10:00', value: '09:00' },
    { id: 2, time: '10:00 - 11:00', value: '10:00' },
    { id: 3, time: '11:00 - 12:00', value: '11:00' },
    { id: 4, time: '12:00 - 13:00', value: '12:00' },
    { id: 5, time: '13:00 - 14:00', value: '13:00' },
    { id: 6, time: '14:00 - 15:00', value: '14:00' },
    { id: 7, time: '15:00 - 16:00', value: '15:00' },
    { id: 8, time: '16:00 - 17:00', value: '16:00' },
    { id: 9, time: '17:00 - 18:00', value: '17:00' },
  ];

  // ตรวจสอบว่าวันนั้นคิวเต็มหรือไม่
  const isDateFull = (date) => {
    return bookedSlots[date]?.length === timeSlots.length;
  };

  // ตรวจสอบว่า slot นั้นถูกจองแล้วหรือไม่
  const isSlotBooked = (date, slotId) => {
    return bookedSlots[date]?.some(booking => booking.slotId === slotId);
  };

  // นับจำนวนคิวที่ว่างในวันนั้น
  const getAvailableSlots = (date) => {
    const booked = bookedSlots[date]?.length || 0;
    return timeSlots.length - booked;
  };

  // ส่ง OTP
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
      return;
    }

    // สร้าง OTP 6 หลัก
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setOtpTimer(120);
    setOtp('');
    setOtpVerified(false);

    // แสดง OTP ในคอนโซล (จำลอง - ในระบบจริงจะส่ง SMS)
    console.log('OTP ของคุณคือ:', newOtp);
    alert(`OTP ของคุณคือ: ${newOtp}\n(ในระบบจริงจะส่งไปที่ SMS)`);
  };

  // ยืนยัน OTP
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      alert('ยืนยัน OTP สำเร็จ!');
    } else {
      alert('OTP ไม่ถูกต้อง กรุณาลองใหม่');
      setOtp('');
    }
  };

  // จองคิว
  const handleBooking = () => {
    if (!selectedSlot || !customerName.trim() || !otpVerified) {
      alert('กรุณากรอกข้อมูลให้ครบและยืนยัน OTP');
      return;
    }

    if (isDateFull(selectedDate)) {
      alert('วันนี้คิวเต็มแล้ว กรุณาเลือกวันอื่น');
      return;
    }

    const booking = {
      slotId: selectedSlot,
      name: customerName,
      phone: phoneNumber,
      time: timeSlots.find(s => s.id === selectedSlot)?.time,
      bookedAt: new Date().toISOString()
    };

    setBookedSlots(prev => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), booking]
    }));

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedSlot(null);
      setCustomerName('');
      setPhoneNumber('');
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setOtpTimer(0);
    }, 2000);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (isDateFull(newDate)) {
      alert('วันนี้คิวเต็มแล้ว กรุณาเลือกวันอื่น');
      return;
    }
    setSelectedDate(newDate);
    setSelectedSlot(null);
  };

  // จัดรูปแบบวันที่เป็นภาษาไทย
  const formatDateThai = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('th-TH', options);
  };

  // จัดรูปแบบเวลา
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // จัดรูปแบบวันที่และเวลา
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Booking Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-800">ระบบจองคิว</h1>
              </div>
              <p className="text-gray-600 ml-11">เลือกวันและเวลาที่ต้องการจองคิว</p>
            </div>

            {/* Date Selector */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                เลือกวันที่
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-center py-2 px-4 bg-indigo-50 rounded-lg flex-1 mr-2">
                  <span className="text-indigo-700 font-medium">{formatDateThai(selectedDate)}</span>
                </div>
                <div className={`text-center py-2 px-4 rounded-lg font-medium ${
                  isDateFull(selectedDate) 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {isDateFull(selectedDate) ? 'เต็มแล้ว' : `ว่าง ${getAvailableSlots(selectedDate)} ช่วง`}
                </div>
              </div>
            </div>

            {/* Customer Name Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg"
              />
            </div>

            {/* Phone Number & OTP */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  เบอร์โทรศัพท์
                </div>
              </label>
              
              <div className="space-y-4">
                {/* Phone Input */}
                <div className="flex gap-3">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) setPhoneNumber(value);
                    }}
                    placeholder="0812345678"
                    maxLength="10"
                    disabled={otpVerified}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg disabled:bg-gray-100"
                  />
                  {/* <button
                    onClick={handleSendOtp}
                    disabled={phoneNumber.length !== 10 || (otpTimer > 0) || otpVerified}
                    className={`px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                      ${phoneNumber.length === 10 && otpTimer === 0 && !otpVerified
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {otpTimer > 0 ? `${formatTime(otpTimer)}` : otpVerified ? '✓ ยืนยันแล้ว' : 'ส่ง OTP'}
                  </button> */}
                </div>

                {/* OTP Input */}
                {otpSent && !otpVerified && (
                  <div className="space-y-3 border-t-2 border-gray-100 pt-4">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      กรอก OTP (หมดอายุใน {formatTime(otpTimer)})
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 6) setOtp(value);
                        }}
                        placeholder="123456"
                        maxLength="6"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg text-center tracking-widest font-mono text-2xl"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6}
                        className={`px-6 py-3 rounded-xl font-medium transition-all
                          ${otp.length === 6
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        ยืนยัน
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Verified Status */}
                {otpVerified && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">ยืนยันเบอร์โทรศัพท์สำเร็จ</span>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">เลือกช่วงเวลา</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.map((slot) => {
                  const isBooked = isSlotBooked(selectedDate, slot.id);
                  const isSelected = selectedSlot === slot.id;
                  
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isBooked && setSelectedSlot(slot.id)}
                      disabled={isBooked}
                      className={`
                        p-4 rounded-xl font-medium transition-all duration-200 border-2
                        ${isBooked 
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                          : isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot.time}</span>
                        {isBooked && <span className="text-xs">เต็มแล้ว</span>}
                        {isSelected && <Check className="w-5 h-5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Summary */}
            {selectedSlot && customerName && otpVerified && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">สรุปการจอง</h3>
                <div className="space-y-2 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <p><strong>ชื่อ:</strong> {customerName}</p>
                  <p><strong>เบอร์:</strong> {phoneNumber}</p>
                  <p><strong>วันที่:</strong> {formatDateThai(selectedDate)}</p>
                  <p><strong>เวลา:</strong> {timeSlots.find(s => s.id === selectedSlot)?.time}</p>
                </div>
              </div>
            )}

            {/* Booking Button */}
            <button
              onClick={handleBooking}
              disabled={!selectedSlot || !customerName.trim() || !otpVerified}
              className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
                ${selectedSlot && customerName.trim() && otpVerified
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {!otpVerified 
                ? 'กรุณายืนยัน OTP ก่อนจอง' 
                : selectedSlot && customerName.trim()
                  ? 'ยืนยันการจอง'
                  : 'กรุณากรอกข้อมูลให้ครบถ้วน'
              }
            </button>
          </div>

          {/* Booking List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <List className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-semibold text-gray-800">คิวที่จองแล้ว</h2>
              </div>
              
              {bookedSlots[selectedDate]?.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {bookedSlots[selectedDate]
                    .sort((a, b) => a.slotId - b.slotId)
                    .map((booking, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-100"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {booking.slotId}
                            </div>
                            <span className="font-bold text-indigo-900">{booking.time}</span>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700 ml-10">
                          <p><strong>ชื่อ:</strong> {booking.name}</p>
                          <p><strong>เบอร์:</strong> {booking.phone}</p>
                          <p className="text-xs text-gray-500">
                            จองเมื่อ: {formatDateTime(booking.bookedAt)}
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
              
              {bookedSlots[selectedDate]?.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-gray-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">จำนวนที่จองแล้ว:</span>
                    <span className="font-bold text-indigo-600">
                      {bookedSlots[selectedDate].length} / {timeSlots.length} ช่วง
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform animate-bounce">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h3>
                <p className="text-gray-600 text-center">การจองคิวของคุณเสร็จสมบูรณ์แล้ว</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}