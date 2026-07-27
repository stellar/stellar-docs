import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';
import clsx from 'clsx';

import SparkleIcon from '@site/static/icons/sparkle.svg';
import {
  AGENT_SECTIONS,
  AGENT_TOOLS,
  getAgentTool,
  type SkillsMode,
  type ToolInstructions,
} from '@site/src/data/agentTools';
import useSelectedAgentTool from '@site/src/hooks/useSelectedAgentTool';

import CopyBlock from './CopyBlock';
import styles from './styles.module.scss';

const FOCUSABLE_SELECTOR = 'a[href], button, [tabindex]';

function focusableItems(container: HTMLElement | null): HTMLElement[] {
  if (!container) {
    return [];
  }
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.tabIndex >= 0 && element.offsetParent !== null,
  );
}

/**
 * The "For agents" panel: a floating trigger in the bottom right of every docs
 * page that opens a docked panel of ways to point an AI agent at Stellar.
 *
 * All copy and commands come from `src/data/agentTools`, which the Building
 * with AI page renders too, so the two can never disagree.
 */
export default function ForAgentsPanel(): ReactNode {
  const { pathname } = useLocation();
  const docsBaseUrl = useBaseUrl('/docs');
  const llmsTxtUrl = useBaseUrl(AGENT_SECTIONS.llmsTxt.href);
  const [open, setOpen] = useState(false);
  const [toolId, selectTool] = useSelectedAgentTool();
  const [skillsMode, setSkillsMode] = useState<SkillsMode>('install');

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  const tool = getAgentTool(toolId);

  // A docked panel would cover the content of the page the reader navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Move focus into the panel on open, and hold it there while it is open.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      const items = focusableItems(panelRef.current);
      if (items.length === 0) {
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (active === first || active === panelRef.current)) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Hand focus back to the trigger when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Docs pages only. The homepage and meeting notes have their own layouts.
  if (!pathname.startsWith(docsBaseUrl)) {
    return null;
  }

  const skills = tool.skills[skillsMode];

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={clsx(styles.trigger, open && styles.triggerShifted)}
        aria-expanded={open}
        aria-controls="for-agents-panel"
        onClick={() => setOpen((value) => !value)}>
        <SparkleIcon className={styles.triggerIcon} role="presentation" />
        <Translate
          id="components.ForAgentsPanel.TriggerLabel"
          description="Label of the button that opens the AI agent setup panel">
          For agents
        </Translate>
      </button>

      <div
        id="for-agents-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="for-agents-panel-title"
        tabIndex={-1}
        hidden={!open}
        className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle} id="for-agents-panel-title">
            <Translate
              id="components.ForAgentsPanel.Title"
              description="Accessible name of the AI agent setup panel">
              Use Stellar with AI
            </Translate>
          </span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label={translate({
              message: 'Close',
              id: 'components.ForAgentsPanel.Close',
              description: 'Label for the button that closes the AI agent setup panel',
            })}>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className={styles.panelBody}>
          <ToolPicker selected={tool.id} onSelect={selectTool} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>{AGENT_SECTIONS.raven.title}</h3>
              <Link className={styles.sectionLink} to={AGENT_SECTIONS.raven.guide.href}>
                {AGENT_SECTIONS.raven.guide.label} <Arrow />
              </Link>
            </div>
            <p className={styles.sectionDescription}>{AGENT_SECTIONS.raven.description}</p>
            <Instructions instructions={tool.raven} />
            <div className={styles.sectionFooterLinks}>
              {AGENT_SECTIONS.raven.links.map((link) => (
                <Link key={link.href} className={styles.sectionLink} to={link.href}>
                  {link.label} <Arrow />
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>{AGENT_SECTIONS.skills.title}</h3>
              <Link className={styles.sectionLink} to={AGENT_SECTIONS.skills.home.href}>
                {AGENT_SECTIONS.skills.home.label} <Arrow />
              </Link>
            </div>
            <p className={styles.sectionDescription}>{AGENT_SECTIONS.skills.description}</p>
            <div className={styles.modeToggle} role="group">
              {AGENT_SECTIONS.skills.modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={clsx(styles.pill, skillsMode === mode.id && styles.pillActive)}
                  aria-pressed={skillsMode === mode.id}
                  onClick={() => setSkillsMode(mode.id as SkillsMode)}>
                  {mode.label}
                </button>
              ))}
            </div>
            <Instructions instructions={skills} />
          </section>

          <section className={styles.section}>
            {/* A static file rather than a route, so a plain anchor, not `Link`. */}
            <a className={styles.sectionLink} href={llmsTxtUrl}>
              {AGENT_SECTIONS.llmsTxt.title} <Arrow />
            </a>
            <p className={styles.sectionDescription}>{AGENT_SECTIONS.llmsTxt.description}</p>
          </section>
        </div>
      </div>
    </>
  );
}

function ToolPicker({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}): ReactNode {
  const groupRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (step === 0 && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    event.preventDefault();

    const current = AGENT_TOOLS.findIndex((tool) => tool.id === selected);
    let next: number;
    if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = AGENT_TOOLS.length - 1;
    } else {
      next = (current + step + AGENT_TOOLS.length) % AGENT_TOOLS.length;
    }

    onSelect(AGENT_TOOLS[next].id);
    groupRef.current
      ?.querySelectorAll<HTMLButtonElement>('button')
      ?.[next]?.focus();
  };

  return (
    <div className={styles.toolPicker}>
      <span className={styles.toolPickerLabel} id="for-agents-tool-label">
        <Translate
          id="components.ForAgentsPanel.YourTool"
          description="Label above the AI tool picker">
          Your tool
        </Translate>
      </span>
      <div
        ref={groupRef}
        className={styles.pillRow}
        role="radiogroup"
        aria-labelledby="for-agents-tool-label"
        onKeyDown={onKeyDown}>
        {AGENT_TOOLS.map((tool) => {
          const isSelected = tool.id === selected;
          return (
            <button
              key={tool.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              className={clsx(styles.pill, isSelected && styles.pillActive)}
              onClick={() => onSelect(tool.id)}>
              {tool.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Instructions({ instructions }: { instructions: ToolInstructions }): ReactNode {
  return (
    <>
      {instructions.note && <p className={styles.note}>{instructions.note}</p>}
      {instructions.snippets.map((snippet) => (
        <CopyBlock key={snippet.code} code={snippet.code} />
      ))}
      {instructions.links && (
        <div className={styles.sectionFooterLinks}>
          {instructions.links.map((link) => (
            <Link key={link.href} className={styles.sectionLink} to={link.href}>
              {link.label} <Arrow />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function Arrow(): ReactNode {
  return <span aria-hidden="true">→</span>;
}
