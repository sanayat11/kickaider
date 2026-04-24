import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import { Typography } from '@/shared/ui';
import { Button } from '@/shared/ui/button/view/Button';
import { SelectDropdown } from '@/shared/ui/selectDropdown/view/selectDropdown';
import {
  settingsApi,
  type GeneralSettingsPayload,
  type SettingsLanguage,
} from '../../api/settingsApi';
import styles from './Tabs.module.scss';

const DEFAULT_SETTINGS: GeneralSettingsPayload = {
  timezone: 'Asia/Bishkek',
  language: 'ru',
  idleThresholdSeconds: 60,
  lateToleranceMinutes: 5,
  batchIntervalSeconds: 300,
};

const TIMEZONE_OPTIONS = [
  { label: 'Asia/Bishkek', value: 'Asia/Bishkek' },
  { label: 'Europe/Moscow', value: 'Europe/Moscow' },
  { label: 'Europe/Berlin', value: 'Europe/Berlin' },
  { label: 'America/New_York', value: 'America/New_York' },
];

const IDLE_THRESHOLD_OPTIONS = [30, 60, 120, 300, 600, 900, 1800];
const LATE_TOLERANCE_OPTIONS = [0, 5, 10, 15, 30, 60, 120, 180];
const BATCH_INTERVAL_OPTIONS = [60, 120, 300, 600, 900, 1800, 3600];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
};

const getApiMessage = (payload: unknown): string | null => {
  if (!isRecord(payload)) return null;

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (isRecord(payload.error) && typeof payload.error.message === 'string') {
    return payload.error.message;
  }

  return null;
};

const assertApiSuccess = (payload: unknown): void => {
  if (!isRecord(payload)) return;

  if (payload.success === false || payload.error) {
    throw new Error(getApiMessage(payload) ?? 'API returned unsuccessful response');
  }
};

const extractData = (payload: unknown): Record<string, unknown> => {
  if (!isRecord(payload)) return {};
  if (isRecord(payload.data)) return payload.data;
  return payload;
};

const normalizeSettings = (
  payload: unknown,
  fallback: GeneralSettingsPayload = DEFAULT_SETTINGS,
): GeneralSettingsPayload => {
  const data = extractData(payload);

  const timezone =
    typeof data.timezone === 'string' && data.timezone.trim()
      ? data.timezone
      : fallback.timezone;

  const language: SettingsLanguage = data.language === 'ru' ? 'ru' : fallback.language;

  const idleThresholdSeconds = clamp(
    toNumber(data.idleThresholdSeconds ?? data.idleThreshold, fallback.idleThresholdSeconds),
    30,
    1800,
  );

  const lateToleranceMinutes = clamp(
    toNumber(data.lateToleranceMinutes ?? data.lateTolerance, fallback.lateToleranceMinutes),
    0,
    180,
  );

  const batchIntervalSeconds = clamp(
    toNumber(data.batchIntervalSeconds, fallback.batchIntervalSeconds),
    60,
    3600,
  );

  return {
    timezone,
    language,
    idleThresholdSeconds,
    lateToleranceMinutes,
    batchIntervalSeconds,
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as unknown;
      return getApiMessage(parsed) ?? error.message;
    } catch {
      return error.message;
    }
  }

  return String(error ?? 'Unknown error');
};

const toOption = (value: number) => ({ label: String(value), value: String(value) });

type SaveStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

export const SettingsTab: FC = () => {
  const { i18n, t } = useTranslation();
  const [settings, setSettings] = useState<GeneralSettingsPayload>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(null);

  const timezoneOptions = useMemo(() => {
    if (TIMEZONE_OPTIONS.some((option) => option.value === settings.timezone)) {
      return TIMEZONE_OPTIONS;
    }

    return [{ label: settings.timezone, value: settings.timezone }, ...TIMEZONE_OPTIONS];
  }, [settings.timezone]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await settingsApi.getGeneralSettings();
        assertApiSuccess(response);
        const nextSettings = normalizeSettings(response, DEFAULT_SETTINGS);

        if (!isMounted) return;

        setSettings(nextSettings);

        const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
        if (nextSettings.language !== currentLanguage) {
          await i18n.changeLanguage(nextSettings.language);
        }
      } catch (error) {
        console.error('[SettingsTab] loadGeneralSettings error:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, [i18n]);

  useEffect(() => {
    if (!saveStatus) return;

    const timeoutId = window.setTimeout(() => {
      setSaveStatus(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [saveStatus]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const response = await settingsApi.updateGeneralSettings(settings);
      assertApiSuccess(response);
      const nextSettings = normalizeSettings(response, settings);

      setSettings(nextSettings);

      const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
      if (nextSettings.language !== currentLanguage) {
        await i18n.changeLanguage(nextSettings.language);
      }

      setSaveStatus({ type: 'success', message: t('common.success') });
    } catch (error) {
      console.error('[SettingsTab] saveGeneralSettings error:', error);
      setSaveStatus({
        type: 'error',
        message: `${t('common.error')}: ${getErrorMessage(error)}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const controlsDisabled = loading || saving;

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.grid2}>
        <div className={styles.formGroup}>
          <Typography variant="h4" className={styles.label}>
            {t('settings.general.timezone')}
          </Typography>
          <SelectDropdown
            value={settings.timezone}
            disabled={controlsDisabled}
            onChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
            options={timezoneOptions}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant="h4" className={styles.label}>
            {t('settings.general.language')}
          </Typography>
          <SelectDropdown
            value={settings.language}
            disabled={controlsDisabled}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, language: value as SettingsLanguage }))
            }
            options={[{ label: 'Russian', value: 'ru' }]}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant="h4" className={styles.label}>
            {t('settings.general.idleThreshold')}
          </Typography>
          <SelectDropdown
            value={String(settings.idleThresholdSeconds)}
            disabled={controlsDisabled}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, idleThresholdSeconds: Number(value) }))
            }
            options={IDLE_THRESHOLD_OPTIONS.map(toOption)}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant="h4" className={styles.label}>
            {t('settings.general.lateTolerance')}
          </Typography>
          <SelectDropdown
            value={String(settings.lateToleranceMinutes)}
            disabled={controlsDisabled}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, lateToleranceMinutes: Number(value) }))
            }
            options={LATE_TOLERANCE_OPTIONS.map(toOption)}
          />
        </div>

        <div className={styles.formGroup}>
          <Typography variant="h4" className={styles.label}>
            {t('settings.general.batchInterval')}
          </Typography>
          <SelectDropdown
            value={String(settings.batchIntervalSeconds)}
            disabled={controlsDisabled}
            onChange={(value) =>
              setSettings((prev) => ({ ...prev, batchIntervalSeconds: Number(value) }))
            }
            options={BATCH_INTERVAL_OPTIONS.map(toOption)}
          />
        </div>
      </div>

      <div className={styles.saveBtnWrap}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          disabled={controlsDisabled}
          className={styles.saveBtn}
          onClick={handleSave}
        >
          {saving ? t('common.loading') : t('settings.general.save')}
        </Button>

        {saveStatus && (
          <Typography
            variant="h5"
            className={
              saveStatus.type === 'error'
                ? `${styles.saveStatus} ${styles.saveStatusError}`
                : `${styles.saveStatus} ${styles.saveStatusSuccess}`
            }
          >
            {saveStatus.message}
          </Typography>
        )}
      </div>
    </div>
  );
};
