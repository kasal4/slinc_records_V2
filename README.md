# Šlinc Records V2

E-shop kazet: katalog, košík, účet, PostgreSQL a základní GDPR / distanční prodej.

Vzdálený repozitář: [github.com/kasal4/slinc_records_V2](https://github.com/kasal4/slinc_records_V2).

## Co umí první verze

- katalog kazet se stavem, DPH v ceně a skladem
- košík v HTTP-only cookie
- registrace, přihlášení, správa skladu
- objednávka s povinností platby, oddělený marketingový souhlas
- export údajů, anonymizace účtu, evidence souhlasů
- cookie lišta (nezbytné vs. analytika / marketing)
- stránky VOP, GDPR, cookies, reklamace, odstoupení
- dvoukrokové tlačítko **Odstoupit od smlouvy**

Platby kartou zatím nejsou. Jde o převod a dobírku, aby se u vás neukládaly údaje o kartě.

## Spuštění

Potřebujete Node 20 a Docker.

```bash
cd slinc-records-V2
cp .env.example .env
# doplňte NEXTAUTH_SECRET, IČO a kontakt
npm install
npm run db:up
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Obchod běží na [http://localhost:3000](http://localhost:3000).

Výchozí správa: `ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` z `.env`.

## Legislativa

Kód umí to, co jde vynutit aplikací. **Není to právní záruka.** Před ostrým prodejem:

1. doplňte IČO, sídlo, telefon, e-mail a daňový režim
2. nechte schválit VOP, reklamační řád a GDPR texty
3. uzavřete smlouvy se zpracovateli (hosting, dopravce, později brána)
4. nasaďte HTTPS
5. rozhodněte, jestli jste plátce DPH

Užitečné zdroje:

- [Předsmluvní informace, MPO](https://mpo.gov.cz/cz/ochrana-spotrebitele/prehledne-o-ochrane-spotrebitele/predsmluvni-informace--290823/)
- [Smlouvy na dálku, ČOI](https://coi.gov.cz/faq/smlouvy-mimo-kamennou-prodejnu-internet-po-telefonu/)

## Git

```bash
git init
git remote add origin https://github.com/kasal4/slinc_records_V2.git
git add .
git commit -m "Initial cassette shop with GDPR and checkout."
git branch -M main
git push -u origin main
```

Do gitu nepatří `.env`.
