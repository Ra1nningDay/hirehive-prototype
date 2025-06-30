"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import api from "@/lib/api/axios-instance";
import { User, Bot, Calendar, BadgeCheck, FileDown } from "lucide-react";

type ChatLogItem = { role: "assistant" | "user"; content: string };
type InterviewSummary = {
  name: string;
  position: string;
  date: string;
  status: string;
  chatLog: ChatLogItem[];
};

type BackendLog = {
  candidate_name: string;
  position: string;
  interview_date: string;
  status: string;
  messages: { role: "assistant" | "user"; content: string }[];
  thread_id?: string;
};

async function fetchInterviewSummary(
  threadId: string
): Promise<InterviewSummary> {
  const res = await api.get<BackendLog>(`/api/interview/log/${threadId}`);
  const data = res.data;
  console.log("Fetched interview summary:", data);
  return {
    name: data.candidate_name,
    position: data.position,
    date: data.interview_date,
    status: data.status,
    chatLog: data.messages,
  };
}

export default function SummarizePage() {
  const { threadId } = useParams();
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false); // State สำหรับการโหลด

  useEffect(() => {
    if (typeof threadId === "string") {
      fetchInterviewSummary(threadId).then(setSummary);
    }
  }, [threadId]);

  const handleDownloadPDF = async () => {
    if (!summary || isDownloading) return;

    setIsDownloading(true); // เริ่มดาวน์โหลด

    try {
      // --- 1. ดึง Base64 ของฟอนต์จากไฟล์ .txt ---
      const fontFileResponse = await fetch("/fonts/THSarabunNew.txt"); // **ตรวจสอบ path ให้ถูกต้อง**
      if (!fontFileResponse.ok) {
        throw new Error(
          `Failed to fetch font file: ${fontFileResponse.statusText}`
        );
      }
      const fontBase64 = (await fontFileResponse.text()).trim(); // .trim() เพื่อลบ space ที่อาจติดมา

      if (!fontBase64 || fontBase64.length < 1000) {
        // ตรวจสอบคร่าวๆ ว่ามีข้อมูล
        alert(
          "ไม่สามารถโหลดข้อมูลฟอนต์ได้ กรุณาตรวจสอบไฟล์ฟอนต์ใน public/fonts/"
        );
        setIsDownloading(false);
        return;
      }

      // 2. ใช้ Dynamic Import กับ ESM ปกติ
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // 3. เพิ่ม VFS และ Font ภาษาไทย (ใช้ fontBase64 ที่โหลดมา)
      const fontName = "THSarabunNew";
      doc.addFileToVFS(`${fontName}-Regular.ttf`, fontBase64);
      doc.addFont(`${fontName}-Regular.ttf`, fontName, "normal");
      doc.setFont(fontName, "normal");

      // 4. สร้างเนื้อหา PDF
      doc.setFontSize(18);
      doc.text("สรุปผลสัมภาษณ์", 14, 18);

      doc.setFontSize(12);
      doc.text(`ชื่อ: ${summary.name}`, 14, 30);
      doc.text(`ตำแหน่ง: ${summary.position}`, 14, 38);
      doc.text(
        `วันที่สัมภาษณ์: ${new Date(summary.date).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        14,
        46
      );
      doc.text(`สถานะ: ${summary.status}`, 14, 54);
      doc.text("ประวัติการสนทนา:", 14, 66);

      const rows = summary.chatLog.map((msg) => [
        msg.role === "assistant" ? "HR" : "ผู้สมัคร",
        doc.splitTextToSize(msg.content, 160),
      ]);

      // 5. เรียกใช้ autoTable
      autoTable(doc, {
        head: [["ผู้พูด", "ข้อความ"]],
        body: rows,
        startY: 70,
        styles: { font: fontName, fontSize: 10 },
        headStyles: {
          fillColor: [255, 236, 139],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          font: fontName,
        },
        theme: "grid",
        didParseCell: function (data) {
          data.cell.styles.font = fontName;
          data.cell.styles.fontStyle = "normal";
          if (data.section === "head") {
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      // 6. บันทึกไฟล์
      doc.save("interview-summary.pdf");
      console.log("PDF generated successfully!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert(
        `เกิดข้อผิดพลาดในการสร้าง PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsDownloading(false); // สิ้นสุดการดาวน์โหลด
    }
  };

  if (!summary) {
    return (
      <div className="p-8 text-center text-gray-500">Loading summary...</div>
    );
  }

  return (
    <>
      <ChatHeader onReset={() => {}} />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col gap-6">
          {/* ... ส่วนแสดงข้อมูล summary ... */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-4 min-w-0">
              <User className="w-8 h-8 text-yellow-600 shrink-0" />
              <div className="min-w-0">
                <div className="text-lg font-bold truncate">
                  {summary.name || (
                    <span className="text-gray-400">ไม่ระบุชื่อ</span>
                  )}
                </div>
                <div className="text-gray-600 flex items-center gap-1 truncate">
                  <BadgeCheck className="w-4 h-4 text-yellow-500" />
                  <span className="truncate">
                    ตำแหน่ง:{" "}
                    {summary.position || (
                      <span className="text-gray-400">-</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-2 md:gap-1 min-w-[180px]">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-yellow-500" />
                <span>
                  วันที่สัมภาษณ์:{" "}
                  {new Date(summary.date).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 w-fit">
                <BadgeCheck className="w-4 h-4 text-yellow-600" />
                {summary.status || <span className="text-gray-400">-</span>}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading} // ปิดปุ่มขณะกำลังดาวน์โหลด
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold flex items-center gap-2 disabled:opacity-70"
            >
              <FileDown className="w-5 h-5" />
              {isDownloading ? "กำลังดาวน์โหลด..." : "ดาวน์โหลด PDF"}
            </Button>
          </div>
        </div>
        <div
          className="bg-white rounded-xl shadow p-4 h-96 overflow-y-auto"
          ref={chatRef}
        >
          {/* ... ส่วนแสดง chat log ... */}
          <div className="flex flex-col gap-3">
            {(summary.chatLog || []).map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "assistant"
                    ? "flex items-start gap-2 text-left"
                    : "flex flex-row-reverse items-start gap-2 text-right"
                }
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-7 h-7 text-yellow-400 bg-yellow-100 rounded-full p-1 border border-yellow-200" />
                ) : (
                  <User className="w-7 h-7 text-blue-400 bg-blue-100 rounded-full p-1 border border-blue-200" />
                )}
                <div>
                  <div
                    className={
                      msg.role === "assistant"
                        ? "font-bold text-yellow-700"
                        : "font-bold text-blue-700"
                    }
                  >
                    {msg.role === "assistant" ? "HR" : "ผู้สมัคร"}
                  </div>
                  <div className="inline-block max-w-[80vw] md:max-w-[40vw] align-top whitespace-pre-line break-words bg-gray-50 rounded px-3 py-2 mt-1 shadow-sm border border-gray-100">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
