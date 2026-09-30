import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowRight, FileSpreadsheet, MessageCircle, NotebookPen } from "lucide-react";

import { KlinaraMark } from "~/components/logo";
import { cn } from "~/lib/cn";

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Dağınık kaynaklar: başlıktaki üç aracın temsili. Başlangıçta eğik ve düzensiz. */
const sources = [
  {
    icon: NotebookPen,
    label: "Randevu defteri",
    text: "Salı 14.00 Şule A. dolgu?",
    textClass: "font-serif italic",
    rotate: -5,
    x: 0,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    text: "Yarın 15.00'e alabilir miyiz?",
    textClass: "",
    rotate: 3.5,
    x: 22,
  },
  {
    icon: FileSpreadsheet,
    label: "Excel",
    text: "hasta_listesi_son_v3.xlsx",
    textClass: "font-mono text-[13px]",
    rotate: -2.5,
    x: 8,
  },
];

/** Aynı bilgilerin Klinara'daki tek takvim satırları. */
const rows = [
  { time: "10:30", name: "Şule Aydın", service: "Kompozit Dolgu", status: "Onaylandı", origin: "Resepsiyon" },
  { time: "14:00", name: "Zeynep Kaya", service: "Diş Taşı Temizliği", status: "Onaylandı", origin: "WhatsApp" },
  { time: "15:00", name: "Can Öztürk", service: "Kanal Tedavisi", status: "Planlandı", origin: "Online" },
];

function FlowVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const done = useInView(ref, { once: true, amount: 0.45 });

  return (
    <div
      ref={ref}
      className="grid items-center gap-6 rounded-card border border-line bg-raised p-5 sm:p-7 md:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.2fr)]"
    >
      {/* Önce: üç ayrı araç, düzensiz. Bölüm görününce hizalanıp soluklaşır. */}
      <div className="grid gap-3" aria-label="Önce: defter, WhatsApp ve Excel">
        {sources.map((source, i) => (
          <motion.div
            key={source.label}
            initial={false}
            animate={
              done
                ? { rotate: 0, x: 0, opacity: 0.55 }
                : { rotate: source.rotate, x: source.x, opacity: 1 }
            }
            transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease }}
            className="rounded-control border border-line bg-surface px-4 py-3"
          >
            <p className="flex items-center gap-2 text-xs font-semibold text-muted">
              <source.icon className="size-3.5" strokeWidth={2} aria-hidden />
              {source.label}
            </p>
            <p className={cn("mt-1.5 truncate text-[15px] text-ink", source.textClass)}>{source.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Geçiş oku: soldan sağa dolar. */}
      <div className="flex justify-center" aria-hidden>
        <motion.span
          initial={false}
          animate={{ opacity: done ? 1 : 0.25, x: done ? 0 : -6 }}
          transition={{ duration: 0.5, delay: 0.55, ease }}
          className="inline-flex size-10 rotate-90 items-center justify-center rounded-full bg-sage-soft text-accent md:rotate-0"
        >
          <ArrowRight className="size-4" strokeWidth={2} />
        </motion.span>
      </div>

      {/* Sonra: tek takvim, her kaydın nereden geldiği görünür. */}
      <div className="rounded-control border border-line bg-surface" aria-label="Sonra: Klinara takvimi">
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <KlinaraMark className="size-5" />
            Bugün
          </p>
          <p className="text-xs text-muted">Merkez şube</p>
        </div>
        <ul>
          {rows.map((row, i) => (
            <motion.li
              key={row.time}
              initial={false}
              animate={{ opacity: done ? 1 : 0, y: done ? 0 : 8 }}
              transition={{ duration: 0.45, delay: 0.75 + i * 0.18, ease }}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
            >
              <span className="text-sm font-semibold tabular-nums">{row.time}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{row.name}</span>
                <span className="block truncate text-[13px] text-muted">{row.service}</span>
              </span>
              <span className="flex flex-col items-end gap-1">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    row.status === "Onaylandı" ? "bg-sage-soft text-accent" : "bg-fill text-muted",
                  )}
                >
                  {row.status}
                </span>
                <span className="text-[11px] text-muted">{row.origin}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Statement() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16 lg:px-8">
      <div className="reveal">
        <p className="font-serif text-3xl font-semibold leading-[1.15] tracking-[-0.02em] md:text-[40px]">
          Kâğıt defter, dağınık WhatsApp yazışmaları ve Excel tabloları.{" "}
          <span className="text-muted">Klinara hepsini tek bir akışta toplar.</span>
        </p>
        <p className="mt-6 max-w-[52ch] text-lg text-muted">
          Resepsiyon, hekim ve uygulayıcılar aynı takvimi görür. Randevunun nereden geldiği, danışana giden her mesaj ve
          imzalanan her onam kayıt altında kalır.
        </p>
      </div>
      <div className="reveal">
        <FlowVisual />
      </div>
    </section>
  );
}
