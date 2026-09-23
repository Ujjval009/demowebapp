import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { ViewKey } from '../../types';

interface TourStep {
  view: ViewKey;
  target: string;
  caption: string;
}

const STEPS: TourStep[] = [
  {
    view: 'dashboard',
    target: '.hero',
    caption:
      'The Dashboard gives owners a single view across every branch — today’s revenue, active stores and loyalty growth.',
  },
  {
    view: 'pos',
    target: '.pos-btn',
    caption:
      'POS & Billing — tap a product to build a bill in seconds. GST is applied automatically, offline-first.',
  },
  {
    view: 'inventory',
    target: 'table',
    caption:
      'Inventory & Baking — watch raw-material stock against reorder levels. Low stock glows amber, and one tap reorders.',
  },
  {
    view: 'expiry',
    target: '.markdown-btn',
    caption:
      'Expiry & Cold Storage — FEFO enforcement flags short-dated batches and applies auto markdowns so nothing is wasted.',
  },
  {
    view: 'analytics',
    target: '.recharts-wrapper',
    caption:
      'Sales Analytics — live charts, branch filters and best-sellers. Everything a franchise owner needs to steer the business.',
  },
  {
    view: 'crm',
    target: '#crm-search',
    caption:
      'CRM & Loyalty — search any customer, check their tier, points and visit history at a glance.',
  },
  {
    view: 'franchise',
    target: 'table',
    caption:
      'Franchise Management — branch scorecards, royalty tracking and compliance status per location.',
  },
];

const AUTOPLAY_MS = 4200;

export function DemoTour() {
  const { tourActive, setTourActive, setView, pushToast } = useApp();
  const [stepIndex, setStepIndex] = useState(0);
  const targetRef = useRef<Element | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const clearHighlight = useCallback(() => {
    if (targetRef.current) {
      targetRef.current.classList.remove('tour-target');
      targetRef.current = null;
    }
  }, []);

  const applyStep = useCallback(
    (index: number) => {
      clearHighlight();
      const s = STEPS[index];
      setView(s.view);
      const timer = window.setTimeout(() => {
        const el = document.querySelector(s.target);
        if (el) {
          el.classList.add('tour-target');
          targetRef.current = el;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 180);
      return () => window.clearTimeout(timer);
    },
    [clearHighlight, setView],
  );

  useEffect(() => {
    if (!tourActive) return;
    applyStep(0);
    setStepIndex(0);
  }, [tourActive, applyStep]);

  useEffect(() => {
    if (!tourActive) return;
    const cleanup = applyStep(stepIndex);
    return cleanup;
  }, [stepIndex, tourActive, applyStep]);

  useEffect(() => {
    if (!tourActive || isLast) return;
    const interval = window.setInterval(() => {
      setStepIndex((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(interval);
  }, [tourActive, stepIndex, isLast]);

  const close = useCallback(() => {
    clearHighlight();
    setTourActive(false);
    if (isLast) pushToast('Demo tour complete — ready to show the client.', 'success');
  }, [clearHighlight, setTourActive, isLast, pushToast]);

  if (!tourActive) return null;

  return (
    <div className="tour-bar" role="dialog" aria-live="polite" aria-label="Guided demo tour">
      <div className="tour-progress" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.view} className={`tour-dot${i <= stepIndex ? ' on' : ''}`} />
        ))}
      </div>
      <div>
        <div className="tour-step">
          STEP {stepIndex + 1} / {STEPS.length}
        </div>
        <div className="tour-caption">{step.caption}</div>
      </div>
      <div className="tour-btns">
        <button type="button" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}>
          ← Prev
        </button>
        {isLast ? (
          <button type="button" className="primary" onClick={close}>
            Finish ✓
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => setStepIndex((i) => i + 1)}>
            Next →
          </button>
        )}
        <button type="button" onClick={close}>
          ✕ Close
        </button>
      </div>
    </div>
  );
}