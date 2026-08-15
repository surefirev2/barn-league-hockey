import {
  parseTeamPreference,
  type TeamPreference,
} from "../lib/team-preference";
import { TEAM_PATH_LABELS } from "../worker/registrations/schema";
import { validateRegistration } from "../worker/registrations/validate";
import type { RegistrationInput } from "../worker/registrations/schema";

const TEAM_CTA_OPEN = "blh:open-register";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        options: { sitekey: string; appearance?: string },
      ) => string;
      getResponse: (widgetId?: string) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

function $(selector: string, root: ParentNode = document): HTMLElement | null {
  return root.querySelector(selector);
}

function formToPayload(
  form: HTMLFormElement,
  signatureImage: string,
): RegistrationInput {
  const data = new FormData(form);
  const bool = (name: string) =>
    data.get(name) === "true" || data.get(name) === "on";
  return {
    teamPreference: String(data.get("teamPreference") ?? ""),
    firstName: String(data.get("firstName") ?? ""),
    lastName: String(data.get("lastName") ?? ""),
    dateOfBirth: String(data.get("dateOfBirth") ?? ""),
    phone: String(data.get("phone") ?? ""),
    email: String(data.get("email") ?? ""),
    emergencyName: String(data.get("emergencyName") ?? ""),
    emergencyRelationship: String(data.get("emergencyRelationship") ?? ""),
    emergencyPhone: String(data.get("emergencyPhone") ?? ""),
    emergencyEmail: String(data.get("emergencyEmail") ?? ""),
    addressLine: String(data.get("addressLine") ?? ""),
    city: String(data.get("city") ?? ""),
    province: String(data.get("province") ?? ""),
    postalCode: String(data.get("postalCode") ?? ""),
    knowsSomeoneInLeague: String(data.get("knowsSomeoneInLeague") ?? ""),
    knownPlayerNames: String(data.get("knownPlayerNames") ?? ""),
    preferredTeammates: String(data.get("preferredTeammates") ?? ""),
    highestLevel: String(data.get("highestLevel") ?? ""),
    primaryPosition: String(data.get("primaryPosition") ?? ""),
    secondaryPosition: String(data.get("secondaryPosition") ?? ""),
    yearsPlayed: String(data.get("yearsPlayed") ?? ""),
    timeSinceRegular: String(data.get("timeSinceRegular") ?? ""),
    abilityRating: String(data.get("abilityRating") ?? ""),
    participation: String(data.get("participation") ?? ""),
    spareInterest: String(data.get("spareInterest") ?? ""),
    depositStatus: String(data.get("depositStatus") ?? ""),
    ackAccuracy: bool("ackAccuracy"),
    ackAdminUse: bool("ackAdminUse"),
    ackDisclosure: bool("ackDisclosure"),
    ackCoverage: bool("ackCoverage"),
    ackRisk: bool("ackRisk"),
    ackBalancedTeams: bool("ackBalancedTeams"),
    signatureName: String(data.get("signatureName") ?? ""),
    signatureImage,
    signedAt: new Date().toISOString(),
  };
}

function clearErrors(form: HTMLFormElement): void {
  form.querySelectorAll<HTMLElement>(".bl-error").forEach((el) => {
    el.textContent = "";
    el.classList.remove("is-visible");
  });
  form.querySelectorAll("[aria-invalid]").forEach((el) => {
    el.removeAttribute("aria-invalid");
  });
}

function paintErrors(
  form: HTMLFormElement,
  errors: Array<{ field: string; message: string }>,
  options: { focus?: boolean } = {},
): void {
  clearErrors(form);
  let first: HTMLElement | null = null;
  for (const error of errors) {
    const messageEl = form.querySelector<HTMLElement>(`#${error.field}-error`);
    if (messageEl) {
      messageEl.textContent = error.message;
      messageEl.classList.add("is-visible");
    }
    const field = form.querySelector<HTMLElement>(`[name="${error.field}"]`);
    if (field) {
      field.setAttribute("aria-invalid", "true");
      if (
        !first &&
        field instanceof HTMLInputElement &&
        field.type !== "hidden"
      ) {
        first = field;
      }
    }
  }
  if (options.focus) {
    first?.focus();
  }
}

function setupSignature(canvas: HTMLCanvasElement): {
  toDataUrl: () => string;
  clear: () => void;
  isEmpty: () => boolean;
  layout: () => void;
} {
  const ctx = canvas.getContext("2d");
  const inert = {
    toDataUrl: () => "",
    clear: () => {},
    isEmpty: () => true,
    layout: () => {},
  };
  if (!ctx) {
    return inert;
  }
  let drawing = false;
  let empty = true;
  const strokeStyle = () => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const ratio = window.devicePixelRatio || 1;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.strokeStyle = "#08080a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };
  const layout = () => {
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.floor(rect.width);
    const cssH = Math.floor(rect.height);
    if (cssW < 8 || cssH < 8) {
      return;
    }
    const w = Math.max(1, Math.floor(cssW * ratio));
    const h = Math.max(1, Math.floor(cssH * ratio));
    if (canvas.width === w && canvas.height === h) {
      strokeStyle();
      return;
    }
    canvas.width = w;
    canvas.height = h;
    strokeStyle();
    empty = true;
  };
  const point = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const stopDrawing = () => {
    drawing = false;
  };
  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }
    event.preventDefault();
    layout();
    drawing = true;
    empty = false;
    const { x, y } = point(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) {
      return;
    }
    const { x, y } = point(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  const observer = new ResizeObserver(() => {
    layout();
  });
  observer.observe(canvas);
  window.addEventListener("resize", layout);
  layout();
  return {
    toDataUrl: () => (empty ? "" : canvas.toDataURL("image/png")),
    clear: () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokeStyle();
      empty = true;
    },
    isEmpty: () => empty,
    layout,
  };
}

async function loadTurnstile(
  siteKey: string,
  host: HTMLElement,
): Promise<string | null> {
  if (!siteKey) {
    return null;
  }
  await new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("turnstile"));
    document.head.appendChild(script);
  });
  if (!window.turnstile) {
    return null;
  }
  return window.turnstile.render(host, {
    sitekey: siteKey,
    appearance: "interaction-only",
  });
}

function onReady(): void {
  const dialog = document.querySelector<HTMLDialogElement>("#register-dialog");
  const form = document.querySelector<HTMLFormElement>("[data-register-form]");
  const success = document.querySelector<HTMLElement>(
    "[data-register-success]",
  );
  if (!dialog || !form || !success) {
    return;
  }

  const teamInput = form.querySelector<HTMLInputElement>("#teamPreference");
  const knownWrap = form.querySelector<HTMLElement>("[data-known-players]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  const networkError = form.querySelector<HTMLElement>("[data-network-error]");
  const canvas = form.querySelector<HTMLCanvasElement>("#signature-pad");
  const signature = canvas ? setupSignature(canvas) : null;
  let dirty = false;
  let historyOpen = false;
  let turnstileWidget: string | null = null;
  let turnstileKey = "";

  const setPath = (team: TeamPreference | null) => {
    if (!teamInput) {
      return;
    }
    teamInput.value = team ?? "";
    dialog.dataset.team = team ?? "individual";
    form
      .querySelectorAll<HTMLButtonElement>("[data-path-pick]")
      .forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(Boolean(team && button.dataset.pathPick === team)),
        );
      });
  };

  const syncAcks = () => {
    const acks =
      form.querySelectorAll<HTMLInputElement>("[data-ack]:checked").length;
    if (submit) {
      submit.disabled = acks < 6;
    }
  };

  const isDirty = () => dirty || (signature ? !signature.isEmpty() : false);

  const showForm = () => {
    form.hidden = false;
    success.hidden = true;
  };

  const showSuccess = (id: string, team: TeamPreference, deposit: string) => {
    form.hidden = true;
    success.hidden = false;
    const idEl = success.querySelector("[data-success-id]");
    const pathEl = success.querySelector("[data-success-path]");
    const pending = success.querySelector<HTMLElement>(
      "[data-success-deposit-pending]",
    );
    const paid = success.querySelector<HTMLElement>(
      "[data-success-deposit-paid]",
    );
    if (idEl) {
      idEl.textContent = id;
    }
    if (pathEl) {
      pathEl.textContent = TEAM_PATH_LABELS[team];
    }
    if (pending && paid) {
      pending.hidden = deposit !== "pending";
      paid.hidden = deposit !== "paid";
    }
    dirty = false;
    signature?.clear();
  };

  const closeDialog = (force = false) => {
    if (!dialog.open) {
      return;
    }
    if (!force && isDirty() && !form.hidden) {
      const ok = window.confirm(
        "Discard this registration? Your answers will be lost.",
      );
      if (!ok) {
        return;
      }
    }
    dialog.close();
  };

  const openDialog = (team: TeamPreference | null) => {
    showForm();
    if (team) {
      setPath(team);
    } else if (teamInput && !teamInput.value) {
      const params = new URLSearchParams(window.location.search);
      setPath(parseTeamPreference(params.get("team")));
    }
    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("register-open");
      const url = new URL(window.location.href);
      url.hash = "register";
      history.pushState(
        { registerDialog: true },
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      historyOpen = true;
    }
    requestAnimationFrame(() => {
      signature?.layout();
    });
  };

  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("register-open");
    if (historyOpen && history.state?.registerDialog) {
      historyOpen = false;
      history.back();
    }
  });

  window.addEventListener("popstate", () => {
    if (dialog.open) {
      historyOpen = false;
      if (isDirty() && !form.hidden) {
        const ok = window.confirm(
          "Discard this registration? Your answers will be lost.",
        );
        if (!ok) {
          history.pushState({ registerDialog: true }, "", window.location.href);
          historyOpen = true;
          return;
        }
      }
      dialog.close();
    }
  });

  document.querySelectorAll("[data-register-close]").forEach((el) => {
    el.addEventListener("click", () => closeDialog());
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  form.querySelectorAll("[data-path-pick]").forEach((el) => {
    el.addEventListener("click", () => {
      const team = parseTeamPreference((el as HTMLElement).dataset.pathPick);
      if (team) {
        setPath(team);
        dirty = true;
      }
    });
  });

  form.addEventListener("input", () => {
    dirty = true;
  });
  form.addEventListener("change", () => {
    dirty = true;
    syncAcks();
    const knows = form.querySelector<HTMLInputElement>(
      'input[name="knowsSomeoneInLeague"]:checked',
    );
    if (knownWrap) {
      knownWrap.hidden = knows?.value !== "yes";
    }
  });

  form
    .querySelector("[data-signature-clear]")
    ?.addEventListener("click", () => {
      signature?.clear();
    });

  form.querySelectorAll("input, textarea").forEach((el) => {
    el.addEventListener("blur", () => {
      const fieldName = (el as HTMLInputElement).name;
      if (!fieldName) {
        return;
      }
      const payload = formToPayload(form, signature?.toDataUrl() ?? "");
      const result = validateRegistration(payload);
      const match = result.ok
        ? []
        : result.errors.filter((error) => error.field === fieldName);
      const messageEl = form.querySelector<HTMLElement>(`#${fieldName}-error`);
      if (match.length > 0) {
        if (messageEl) {
          messageEl.textContent = match[0]?.message ?? "";
          messageEl.classList.add("is-visible");
        }
        el.setAttribute("aria-invalid", "true");
      } else {
        messageEl?.classList.remove("is-visible");
        el.removeAttribute("aria-invalid");
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    networkError?.classList.remove("is-visible");
    const payload = formToPayload(form, signature?.toDataUrl() ?? "");
    if (turnstileWidget && window.turnstile) {
      payload.turnstileToken = window.turnstile.getResponse(turnstileWidget);
    }
    const result = validateRegistration(payload);
    if (!result.ok) {
      paintErrors(form, result.errors, { focus: true });
      return;
    }
    if (submit) {
      submit.disabled = true;
    }
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status >= 500 || response.status === 0) {
        networkError?.classList.add("is-visible");
        syncAcks();
        return;
      }
      if (!response.ok) {
        const body = (await response.json()) as {
          fields?: Array<{ field: string; message: string }>;
        };
        if (body.fields) {
          paintErrors(form, body.fields, { focus: true });
        } else {
          networkError?.classList.add("is-visible");
        }
        syncAcks();
        return;
      }
      const body = (await response.json()) as {
        id: string;
        teamPreference: TeamPreference;
        depositStatus: string;
      };
      showSuccess(body.id, body.teamPreference, body.depositStatus);
    } catch {
      networkError?.classList.add("is-visible");
      syncAcks();
    }
  });

  success
    .querySelector("[data-register-again]")
    ?.addEventListener("click", () => {
      form.reset();
      const province = form.querySelector<HTMLInputElement>("#province");
      if (province) {
        province.value = "ON";
      }
      signature?.clear();
      clearErrors(form);
      dirty = false;
      setPath(null);
      if (knownWrap) {
        knownWrap.hidden = true;
      }
      syncAcks();
      if (turnstileWidget) {
        window.turnstile?.reset(turnstileWidget);
      }
      showForm();
    });

  document.addEventListener(TEAM_CTA_OPEN, ((
    event: CustomEvent<{ team: TeamPreference | null }>,
  ) => {
    openDialog(event.detail?.team ?? null);
  }) as EventListener);

  document
    .querySelectorAll<HTMLAnchorElement>(
      "[data-open-register], a[href='#register']",
    )
    .forEach((el) => {
      el.addEventListener("click", (event) => {
        event.preventDefault();
        const team = parseTeamPreference(el.dataset.teamCta ?? el.dataset.team);
        openDialog(team);
      });
    });

  const params = new URLSearchParams(window.location.search);
  const initialTeam = parseTeamPreference(params.get("team"));
  if (initialTeam) {
    setPath(initialTeam);
  }
  if (window.location.hash === "#register") {
    openDialog(initialTeam);
  }

  void fetch("/api/config")
    .then((response) => (response.ok ? response.json() : null))
    .then((config: { turnstileSiteKey?: string } | null) => {
      turnstileKey = config?.turnstileSiteKey ?? "";
      const host = $("#cf-turnstile", form);
      if (turnstileKey && host) {
        return loadTurnstile(turnstileKey, host).then((id) => {
          turnstileWidget = id;
        });
      }
      return undefined;
    })
    .catch(() => undefined);

  syncAcks();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onReady);
} else {
  onReady();
}
