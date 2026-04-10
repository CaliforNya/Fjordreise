# Fjordreise – rekrutteringsoppgave

Dette repositoriet inneholder løsningen min på en rekrutteringsoppgave: en enkel app for å søke etter og oppsummere ferjereiser. Målet har vært å lage en løsning som er lett å bruke, med ryddig kode og fornuftig håndtering av logikk.

**Live demo (Vercel):** https://fjordreise-plum.vercel.app/

## Slik fungerer appen

1. Velg fra/til, dato (og returdato hvis tur/retur), antall reisende og eventuelle kjøretøy.
2. Trykk «Søk» for å se tilgjengelige avganger.
3. Velg ønsket avgang (og retur hvis aktuelt).
4. Gå til «Summary» for å se en oppsummering med pris.

Det ligger også en liten «Slik fungerer det»-boks på forsiden.

## Validering

Jeg har lagt inn validering for blant annet:
- at fra og til ikke er like
- at datoer er gyldige
- at barn/dyr ikke reiser alene
- at antall kjøretøy gir mening i forhold til antall voksne

Så ja – her slipper vi at et barn med 2 dyr prøver å reise med 20 sykler 😄

## Hva jeg har fokusert på

- Tydelig og lesbar kode
- Enkle, gjenbrukbare komponenter
- God flyt gjennom appen (fra søk til oppsummering)
- Responsivt design som funker på ulike skjermstørrelser

## Teknologistack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS

## Kjøring lokalt

```bash
npm install
npm run dev