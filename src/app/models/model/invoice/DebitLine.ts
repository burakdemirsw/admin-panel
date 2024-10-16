

export class DebitLine {
    id: string; // UNIQUEIDENTIFIER
    debitHeaderId: string; // DebitHeader ile ilişkilendirilmiş ID
    lineDescription?: string; // Satır Açıklaması, nullable
    docCurrencyCode?: string; // Doküman Para Birimi Kodu, nullable
    currAccCurrencyCode?: string; // Cari Hesap Para Birimi Kodu, nullable
    creditAmount: number; // Kredi Tutarı
    debitAmount: number; // Borç Tutarı
    dueDate: Date;
    debitReasonCode: string;
    createdDate?: Date; // Oluşturulma Tarihi, nullable
    updatedDate?: Date; // Güncellenme Tarihi, nullable
}
