# 🥙 City Kebab - Grupna Narudžba

> **Napravite grupnu narudžbu s prijateljima u City Kebabu - brzo, jednostavno i praktično!**

[![Live Production](https://img.shields.io/badge/Live%20Production-https://kebab.ilijaleko.com/-orange?style=for-the-badge&logo=firebase)](https://kebab.ilijaleko.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0.0-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## O aplikaciji

**City Kebab** je web aplikacija za grupne narudžbe u bjelovarskom City Kebabu. Omogućava prijateljima da se organiziraju, dodaju svoje kebab kombinacije u zajedničku narudžbu i generiraju SMS format za slanje restoranu.

### Ključne značajke

- 🎯 **Grupne narudžbe** - Kreirajte grupe i pozovite prijatelje
- 📱 **SMS format** - Automatski generirani SMS za slanje
- 💾 **Spremanje recepata** - Sačuvajte omiljene kombinacije
- 📲 **PWA** - Instalirajte na mobitel kao aplikaciju
- 🌙 **Dark/Light mode** - Prilagodite sučelje
- 📱 **Responsive** - Radi na svim uređajima

## Kako funkcionira?

1. **Kreirajte narudžbu** - Kliknite "Kreiraj narudžbu" i podijelite ID grupe
2. **Dodajte svoju narudžbu** - Odaberite vrstu kebaba, veličinu, dodatke i umak
3. **Generirajte SMS** - Kliknite "Generiraj SMS format" i pošaljite restoranu
4. **Preuzmite narudžbu** - Idite u City Kebab u dogovoreno vrijeme

## Pokretanje lokalno

```bash
# Klonirajte repozitorij
git clone https://github.com/ilijaleko/city-kebab.git
cd city-kebab

# Instalirajte potrebne pakete
npm install

# Pokrenite development server
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:5173`

## Konfiguracija Firebase

1. Kreirajte Firebase projekt na [Firebase Console](https://console.firebase.google.com/)
2. Omogućite Firestore Database
3. Kopirajte konfiguraciju u `src/firebase.ts`
4. Deploy: `firebase deploy`

### Instalacija na mobitel

**Android:** Chrome/Edge → "..." meni → "Instaliraj aplikaciju"
**iPhone:** Safari → "Dijeli" → "Dodaj na početni ekran"

## Suradnja

1. **Kreirajte issue** - Diskutirajte feature/bug prije rada
2. **Fork** repozitorij
3. **Kreirajte** feature branch (`git checkout -b feature/i-<issue-number>/AmazingFeature`)
4. **Commit** promjene (`git commit -m 'Add some AmazingFeature'`)
5. **Push** na branch (`git push origin feature/i-<issue-number>AmazingFeature`)
6. **Otvori** Pull Request

### Development Guidelines

- Koristite ESLint za code quality
- Pišite jasne commit poruke
- Testirajte promjene na različitim uređajima

## Autor

**Ilija Leko**

- Website: [ilijaleko.com](https://ilijaleko.com)
- GitHub: [@ilijaleko](https://github.com/ilijaleko)

---

<div align="center">

**Od ❤️ za City Kebab**

[🌐 Live production](https://kebab.ilijaleko.com/) | [📧 Kontakt](mailto:ilija.leko.hr@gmail.com) | [🐛 Report Bug](https://github.com/ilijaleko/city-kebab/issues)

</div>
