"use client";

import { useEffect, useRef, useState } from "react";

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracks = [
    {
      title: "Nope your too late",
      src: "/audio/nope-your-too-late.mp3",
      cover: "/covers/nope-your-too-late.jpg",
    },
    {
      title: "fall",
      src: "/audio/fall.mp3",
      cover: "/covers/fall.jpg",
    },
  ];
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgActive, setBgActive] = useState<"a" | "b">("a");
  const [bgA, setBgA] = useState(tracks[0].cover);
  const [bgB, setBgB] = useState(tracks[0].cover);
  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleTime = () => setCurrentTime(audio.currentTime || 0);
    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % tracks.length);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [trackIndex]);

  useEffect(() => {
    setBgActive((prev) => {
      const next = prev === "a" ? "b" : "a";
      if (next === "a") {
        setBgA(currentTrack.cover);
      } else {
        setBgB(currentTrack.cover);
      }
      return next;
    });
  }, [trackIndex, currentTrack.cover]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handlePrevious = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleNext = () => {
    setTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  return (
    <main className="page">
      <div className="background">
        <img
          className={`background-image ${
            bgActive === "a" ? "is-active" : ""
          }`}
          src={bgA}
          alt=""
          aria-hidden="true"
        />
        <img
          className={`background-image ${
            bgActive === "b" ? "is-active" : ""
          }`}
          src={bgB}
          alt=""
          aria-hidden="true"
        />
        <div className="background-overlay" />
        <div className="background-grain" />
      </div>

      <section className="card">
        <img className="avatar" src="/cat01.jpg" alt="Foto de perfil" />
        <div className="identity">
          <h1>tizil</h1>
          <div className="location">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.75c-3.73 0-6.75 3.02-6.75 6.75 0 4.72 6.75 11.75 6.75 11.75s6.75-7.03 6.75-11.75C18.75 5.77 15.73 2.75 12 2.75Zm0 9.5a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z" />
            </svg>
            <span>Fortaleza</span>
          </div>
        </div>

        <div className="socials">
          <div className="social-item">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19.52 5.17A18.3 18.3 0 0 0 14.98 4a12.9 12.9 0 0 0-.6 1.23 17.5 17.5 0 0 0-4.76 0A12.9 12.9 0 0 0 9.02 4a18.3 18.3 0 0 0-4.54 1.17C2.2 8.3 1.6 11.34 1.8 14.33a18.3 18.3 0 0 0 5.57 2.89c.47-.64.9-1.32 1.27-2.04-.7-.26-1.36-.58-1.98-.97.17-.12.33-.26.5-.39a12.7 12.7 0 0 0 11.68 0c.17.13.33.27.5.39-.62.39-1.29.71-1.98.97.37.72.8 1.4 1.27 2.04a18.3 18.3 0 0 0 5.57-2.89c.22-3.34-.38-6.37-2.18-9.16Zm-9.4 7.59c-.86 0-1.56-.8-1.56-1.78 0-.98.69-1.78 1.56-1.78.88 0 1.58.8 1.57 1.78 0 .98-.69 1.78-1.57 1.78Zm5.76 0c-.86 0-1.56-.8-1.56-1.78 0-.98.69-1.78 1.56-1.78.88 0 1.58.8 1.57 1.78 0 .98-.69 1.78-1.57 1.78Z" />
            </svg>
            <span>gustavotizil</span>
          </div>

          <a
            className="social-item link"
            href="https://github.com/gustavoareis"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5c-5.3 0-9.6 4.3-9.6 9.6 0 4.25 2.78 7.86 6.64 9.13.48.08.66-.2.66-.47v-1.67c-2.7.59-3.27-1.15-3.27-1.15-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.58.07-.58 1 .07 1.52 1.01 1.52 1.01.88 1.52 2.3 1.08 2.86.82.09-.65.35-1.08.64-1.33-2.15-.25-4.42-1.08-4.42-4.79 0-1.06.38-1.93 1.01-2.61-.1-.25-.44-1.27.1-2.65 0 0 .82-.26 2.68 1a9.4 9.4 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .54 1.38.2 2.4.1 2.65.63.68 1.01 1.55 1.01 2.61 0 3.72-2.27 4.54-4.43 4.79.36.31.68.92.68 1.86v2.76c0 .27.17.55.67.46a9.6 9.6 0 0 0 6.63-9.12c0-5.3-4.3-9.6-9.6-9.6Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </section>

      <section className="player">
        <img
          className="cover"
          src={currentTrack.cover}
          alt="Capa da música"
        />
        <div className="track">
          <div className="track-title">{currentTrack.title}</div>
          <div className="track-row">
            <span className="time">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 1}
              step={0.01}
              value={currentTime}
              onChange={(event) =>
                handleSeek(Number(event.currentTarget.value))
              }
              aria-label="Progresso da música"
            />
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>
        <div className="player-controls">
          <button
            className="icon-button"
            type="button"
            aria-label="Faixa anterior"
            onClick={handlePrevious}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 6h2v12H7V6Zm3.5 6 9 6V6l-9 6Z" />
            </svg>
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.75 5.25h3v13.5h-3V5.25Zm7.5 0h3v13.5h-3V5.25Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.5 5.25 18.75 12 7.5 18.75v-13.5Z" />
              </svg>
            )}
          </button>
          <button
            className="icon-button"
            type="button"
            aria-label="Próxima faixa"
            onClick={handleNext}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14.5 12-9-6v12l9-6ZM15 6h2v12h-2V6Z" />
            </svg>
          </button>
        </div>
      </section>

      <audio
        ref={audioRef}
        preload="metadata"
        src={currentTrack.src}
      />
    </main>
  );
}
