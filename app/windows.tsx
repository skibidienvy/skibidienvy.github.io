'use client';

import { useEffect, useRef, useState } from 'react';
import { DesktopWindow, useWindowStack } from './desktop-window';
import { CurrentlyPlayingWindow } from './music-player';

const WINDOW_IDS = ['intro', 'socials', 'likes', 'music', 'projects'] as const;

const socials = [
  { name: 'discord', username: '@enviouss.org', icon: '/icons/discord.png' },
  { name: 'tiktok', username: '@impossiblebydesign', icon: '/icons/tiktok.png' },
  { name: 'steam', username: '@skibidienvious', icon: '/icons/steam.png' },
  { name: 'github', username: '@skibidienvy', icon: '/icons/github.svg' },
] as const;

const likes = [
  { name: 'undertale', icon: '/icons/undertale.svg', iconClass: '' },
  { name: 'portal 2', icon: '/icons/aperture-science.svg', iconClass: '' },
  { name: 'vibecoding', icon: '/icons/claude.svg', iconClass: '' },
] as const;

const projects = [
  {
    name: 'radium client',
    icon: '/icons/radium.png',
    description: 'minecraft cheat owned by popular dev nnpg',
    href: 'https://radiumclient.com',
  },
  {
    name: 'fern tas',
    icon: '/icons/ferntas.png',
    description: 'most advanced subway surfers tas tool at the time',
    href: null,
  },
  {
    name: 'frostbite',
    icon: '/icons/frostbite.svg',
    description: 'il2cpp android modding library for java',
    href: 'https://github.com/outcastsoftware/frostbite/',
  },
  {
    name: 'fern client',
    icon: '/icons/fern-client.png',
    description: 'the most advanced minecraft pvp and donutsmp cheat',
    href: 'https://fernclient.com/discord',
  },
] as const;

export function DesktopWindows() {
  const { zOf, bringToFront } = useWindowStack(WINDOW_IDS);
  const [copied, setCopied] = useState('');
  const [blockedProject, setBlockedProject] = useState<string | null>(null);
  const clearCopiedTimer = useRef<number | undefined>(undefined);
  const clearBlockedTimer = useRef<number | undefined>(undefined);
  const blockedFrame = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(clearCopiedTimer.current);
      window.clearTimeout(clearBlockedTimer.current);
      if (blockedFrame.current !== undefined) {
        window.cancelAnimationFrame(blockedFrame.current);
      }
    },
    [],
  );

  const copyUsername = async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
    } catch {
      const input = document.createElement('textarea');
      input.value = username;
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    setCopied(username);
    window.clearTimeout(clearCopiedTimer.current);
    clearCopiedTimer.current = window.setTimeout(() => setCopied(''), 1600);
  };

  const showBlocked = (projectName: string) => {
    setBlockedProject(null);
    window.clearTimeout(clearBlockedTimer.current);
    if (blockedFrame.current !== undefined) {
      window.cancelAnimationFrame(blockedFrame.current);
    }
    blockedFrame.current = window.requestAnimationFrame(() => {
      setBlockedProject(projectName);
      clearBlockedTimer.current = window.setTimeout(
        () => setBlockedProject(null),
        700,
      );
    });
  };

  return (
    <div className="desktop-ui">
      <DesktopWindow id="intro" title="hiiii..." className="intro-window" z={zOf('intro')} onFocus={bringToFront}>
        <div className="intro-layout">
          <p className="intro-copy">
            im envy (or jamie)
            <br />
            and people think im a
            <br />
            catboy/transgender or sum
          </p>
          <img className="intro-avatar" src="/icons/intro-avatar.png" alt="envy avatar" />
        </div>
      </DesktopWindow>

      <DesktopWindow id="socials" title="socials:" className="socials-window" z={zOf('socials')} onFocus={bringToFront}>
        <div className="social-grid">
          {socials.map((social) => (
            <button
              key={social.name}
              className="social-button"
              type="button"
              onClick={() => copyUsername(social.username)}
              title={`copy ${social.username}`}
              aria-label={`copy ${social.name} username ${social.username}`}
            >
              <img src={social.icon} alt="" />
              <span>{social.name}</span>
            </button>
          ))}
        </div>
        <p className="copy-status" aria-live="polite">
          {copied ? `copied ${copied}` : 'click an icon to copy'}
        </p>
      </DesktopWindow>

      <DesktopWindow id="likes" title="i like..." className="likes-window" z={zOf('likes')} onFocus={bringToFront}>
        <ul className="likes-grid">
          {likes.map((like) => (
            <li key={like.name} className="like-card">
              <img className={like.iconClass} src={like.icon} alt="" />
              <span>{like.name}</span>
            </li>
          ))}
        </ul>
      </DesktopWindow>

      <CurrentlyPlayingWindow z={zOf('music')} onFocus={bringToFront} />

      <DesktopWindow id="projects" title="i worked on..." className="projects-window" z={zOf('projects')} onFocus={bringToFront}>
        <div className="project-grid">
          {projects.map((project) => {
            const content = (
              <>
                <img src={project.icon} alt="" />
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </>
            );

            return project.href ? (
              <a key={project.name} className="project-card" href={project.href}>
                {content}
              </a>
            ) : (
              <button
                key={project.name}
                className={`project-card project-card-blocked${blockedProject === project.name ? ' is-blocked' : ''}`}
                type="button"
                onClick={() => showBlocked(project.name)}
              >
                {content}
                <span className="blocked-label" aria-live="polite">
                  {blockedProject === project.name ? 'blocked' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </DesktopWindow>
    </div>
  );
}
