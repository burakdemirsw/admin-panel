

export class DebitHeader {
    id: string; // UNIQUEIDENTIFIER
    debitTypeCode: number; // DebitTypeCode
    debitNumber?: string; // Kasa Fiş Referans Numarası, nullable
    description?: string; // Açıklama, nullable
    currAccTypeCode?: number; // Cari Hesap Tipi Kodu, nullable
    currAccCode?: string; // Cari Hesap Kodu, nullable
    officeCode: string; // Ofis Kodu
    storeTypeCode: number; // Mağaza Tipi Kodu
    storeCode?: string; // Mağaza Kodu, nullable
    applicationCode: string; // Uygulama Kodu
    raportUrl?: string; // Rapor URL'si, nullable
    userId: number; // Kullanıcı ID
    isCompleted: boolean; // Tamamlanma Durumu
    createdDate?: Date; // Oluşturulma Tarihi, nullable
    updatedDate?: Date; // Güncellenme Tarihi, nullable
}
