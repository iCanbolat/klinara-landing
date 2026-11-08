/**
 * Hastanın WhatsApp'ında Klinara şablon mesajları. Basılı A5 broşürdeki
 * (klinara/assets/print/template.html `.phone`) mock'un ekran sürümü; ölçüler
 * kapsayıcı genişliğine (cqw) bağlı, PhoneFrame içinde ekran oranını doldurur.
 */

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="size-[5cqw] shrink-0" aria-hidden>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="size-[5cqw] shrink-0" aria-hidden>
    <path d="M9 14L4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 5 5v6" />
  </svg>
);

function Day({ children }: { children: React.ReactNode }) {
  return (
    <span className="justify-self-center rounded-[3.2cqw] bg-white px-[4cqw] py-[0.7cqw] text-[3.7cqw] font-semibold text-[#6b736e] dark:bg-[#1f2c34] dark:text-[#8696a0]">
      {children}
    </span>
  );
}

function Button({ icon, children }: { icon: "reply" | "link"; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-[2.3cqw] border-t-[0.56cqw] border-[#ebe6df] px-[2.3cqw] py-[1.6cqw] font-semibold text-[#1d7a8c] dark:border-[#2a3942] dark:text-[#53bdeb]">
      {icon === "reply" ? <ReplyIcon /> : <ExternalIcon />}
      {children}
    </div>
  );
}

function Message({ text, time, children }: { text: string; time: string; children: React.ReactNode }) {
  return (
    <div className="max-w-[94%] overflow-hidden rounded-[4cqw] bg-white shadow-[0_0.45cqw_0_rgb(0_0_0/0.08)] dark:bg-[#1f2c34]">
      <div className="whitespace-pre-line px-[4cqw] pb-[1.4cqw] pt-[3.2cqw]">{text}</div>
      <div className="px-[4cqw] pb-[1.6cqw] text-right text-[3.2cqw] text-[#8a918c] dark:text-[#8696a0]">{time}</div>
      {children}
    </div>
  );
}

export function WhatsAppChatScreen() {
  return (
    <div className="@container" role="img" aria-label="Hastanın telefonunda Klinara WhatsApp şablon mesajları: randevu oluşturuldu ve hatırlatma, Onaylıyorum yanıtı">
      <div className="flex aspect-[1206/2622] flex-col overflow-hidden bg-[#ece6dd] text-[3.75cqw] leading-[1.38] text-[#1f2421] dark:bg-[#0b141a] dark:text-[#e9edef]" aria-hidden>
        <div className="bg-[#f6f3ee] dark:bg-[#1f2c34]">
          <div className="flex items-center justify-between px-[9cqw] pb-[1.5cqw] pt-[4cqw] text-[4.1cqw] font-bold">
            <span>09:41</span>
            <i className="block h-[8cqw] w-[30cqw] rounded-full bg-[#1d211f]" />
            <span className="tracking-[-0.1em]">●●●</span>
          </div>
          <div className="flex items-center gap-[4cqw] border-b-[0.56cqw] border-[#ddd5ca] px-[5.9cqw] pb-[3.2cqw] pt-[2.4cqw] dark:border-[#2a3942]">
            <span className="flex size-[12.7cqw] shrink-0 items-center justify-center rounded-full bg-[#5e7856] text-[4.5cqw] font-bold text-white">G</span>
            <div>
              <b className="block text-[4.6cqw]">Gülümse Diş Kliniği</b>
              <small className="block text-[3.7cqw] text-[#6b736e] dark:text-[#8696a0]">İşletme hesabı</small>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 content-start gap-[2.2cqw] px-[4.5cqw] pb-[4.5cqw] pt-[3.2cqw]">
          <Day>Dün</Day>
          <Message
            time="10:12"
            text={"Merhaba Ayşe, 12.11.2026 14:00 tarihindeki Kanal Tedavisi randevunuz oluşturuldu. Sizi Moda şubemizde bekliyoruz.\n\nAdres: Moda Cad. 12, Kadıköy\n\nRandevunuzu değiştirmeniz gerekirse aşağıdaki butonu kullanabilirsiniz."}
          >
            <Button icon="link">Randevuyu değiştir</Button>
            <Button icon="link">Haritada aç</Button>
          </Message>
          <Day>Bugün</Day>
          <Message
            time="14:00"
            text="Merhaba Ayşe, 12.11.2026 14:00 tarihindeki Kanal Tedavisi randevunuzu hatırlatırız. Katılımınızı aşağıdaki butonlarla bildirebilirsiniz."
          >
            <Button icon="reply">Onaylıyorum</Button>
            <Button icon="reply">İptal etmek istiyorum</Button>
            <Button icon="link">Haritada aç</Button>
          </Message>
          <div className="justify-self-end rounded-[4cqw] bg-[#d9f1d0] px-[4cqw] pb-[1.8cqw] pt-[2.5cqw] font-medium dark:bg-[#005c4b]">
            Onaylıyorum
            <span className="ml-[3.2cqw] text-[3.35cqw] text-[#6f8a6a] dark:text-[#8fc9b8]">14:03 ✓✓</span>
          </div>
        </div>

        <div className="flex items-center gap-[2.5cqw] bg-[#f6f3ee] px-[4cqw] pb-[7cqw] pt-[2.5cqw] dark:bg-[#1f2c34]">
          <span className="flex-1 rounded-full border-[0.4cqw] border-[#ddd5ca] bg-white px-[4cqw] py-[2.2cqw] text-[#8a918c] dark:border-transparent dark:bg-[#2a3942] dark:text-[#8696a0]">
            Mesaj
          </span>
          <span className="size-[10cqw] shrink-0 rounded-full bg-[#5e7856]" />
        </div>
      </div>
    </div>
  );
}
