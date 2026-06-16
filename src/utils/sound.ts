/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple client-side synthesized sound generator using Web Audio API
// This avoids any loading errors or need for hosting public MP3 assets

let audioCtx: AudioContext | null = null;
let isMutedGlobal = false;

// Initialize audio context safely on first user click to bypass autoplays restriction
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window || "webkitAudioContext" in window)) {
    return null;
  }
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundManager = {
  getMuteStatus() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creatoros_muted");
      if (stored !== null) return stored === "true";
    }
    return isMutedGlobal;
  },

  setMuteStatus(muted: boolean) {
    isMutedGlobal = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("creatoros_muted", String(muted));
    }
  },

  // Play delicate digital click
  playClick() {
    if (this.getMuteStatus()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Natural soft woodblock-like click
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      // Simple low pass filter to make it softer and warmer
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio click play failed:", e);
    }
  },

  // Play light sci-fi tick for hover
  playHover() {
    if (this.getMuteStatus()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Slid gracefully
    }
  },

  // Play gorgeous premium success chime
  playSuccess() {
    if (this.getMuteStatus()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Synthesize a beautiful sparkling glass chime chord (minor 7th with an add9)
      // Notes: C5 (523.25), Eb5 (622.25), G5 (783.99), Bb5 (932.33), D6 (1174.66)
      const freqs = [523.25, 622.25, 783.99, 932.33, 1174.66];
      
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        
        // Soft glowing decay
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.8);
        
        // Gentle bandpass to isolate glassy ring
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq, now);
        filter.Q.setValueAtTime(8, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.95);
      });
    } catch (e) {
      console.warn("Audio success play failed:", e);
    }
  },

  // Sparkly digital synth sweep
  playCompile() {
    if (this.getMuteStatus()) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.5);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.55);
    } catch (e) {
      // Ignored
    }
  }
};
