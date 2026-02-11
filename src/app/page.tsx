"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

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
  const [volume, setVolume] = useState(0.2);
  const [bgActive, setBgActive] = useState<"a" | "b">("a");
  const [bgA, setBgA] = useState(tracks[0].cover);
  const [bgB, setBgB] = useState(tracks[0].cover);
  const [coverA, setCoverA] = useState(tracks[0].cover);
  const [coverB, setCoverB] = useState(tracks[0].cover);
  const currentTrack = tracks[trackIndex];
  const progressPercent =
    duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const volumePercent = Math.round(volume * 100);

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
    audio.volume = volume;

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
        setCoverA(currentTrack.cover);
      } else {
        setBgB(currentTrack.cover);
        setCoverB(currentTrack.cover);
      }
      return next;
    });
  }, [trackIndex, currentTrack.cover]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

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

  const handleVolumeChange = (value: number) => {
    const clamped = Math.min(1, Math.max(0, value / 100));
    setVolume(clamped);
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
        <img className="avatar" src="/cat02.jpg" alt="Foto de perfil" />
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
          <a
            className="social-item link"
            href="https://discord.com/users/1064312764174176298"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              className="discord-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.903 13.903 0 0 0-.604 1.26 18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.26.074.074 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.026c.461-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.076.076 0 0 1-.008-.127c.126-.095.252-.192.371-.291a.074.074 0 0 1 .078-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .079.01c.12.099.245.197.371.291a.076.076 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.106c.359.698.771 1.363 1.226 1.994a.076.076 0 0 0 .084.026 19.9 19.9 0 0 0 6.002-3.03.077.077 0 0 0 .031-.056c.5-5.177-.839-9.673-3.548-13.661a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.093 2.156 2.419 0 1.334-.955 2.418-2.156 2.418Zm7.975 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.093 2.156 2.419 0 1.334-.946 2.418-2.156 2.418Z" />
            </svg>
            <span>gustavotizil</span>
          </a>

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
        <div className="cover-stack" aria-hidden="true">
          <img
            className={`cover-image ${
              bgActive === "a" ? "is-active" : ""
            }`}
            src={coverA}
            alt=""
          />
          <img
            className={`cover-image ${
              bgActive === "b" ? "is-active" : ""
            }`}
            src={coverB}
            alt=""
          />
        </div>
        <div className="track">
          <div className="track-title">{currentTrack.title}</div>
          <div className="track-row">
            <span className="time">{formatTime(currentTime)}</span>
            <div
              className="progress"
              style={
                {
                  "--progress": `${progressPercent}%`,
                } as CSSProperties
              }
            >
              <div className="progress-track" aria-hidden="true" />
              <div className="progress-fill" aria-hidden="true" />
              <input
                className="progress-input"
                type="range"
                min={0}
                max={duration > 0 ? duration : 1}
                step={0.01}
                value={currentTime}
                onInput={(event) =>
                  handleSeek(Number(event.currentTarget.value))
                }
                aria-label="Progresso da música"
              />
            </div>
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

      <div className="volume-widget">
        <svg
          className="volume-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77Z" />
        </svg>
        <div
          className="volume-bar"
          style={
            {
              "--volume": `${volumePercent}%`,
            } as CSSProperties
          }
        >
          <div className="volume-track" aria-hidden="true" />
          <div className="volume-fill" aria-hidden="true" />
          <input
            className="volume-input"
            type="range"
            min={0}
            max={100}
            step={1}
            value={volumePercent}
            onChange={(event) =>
              handleVolumeChange(Number(event.currentTarget.value))
            }
            aria-label="Volume"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        src={currentTrack.src}
      />
    </main>
  );
}
