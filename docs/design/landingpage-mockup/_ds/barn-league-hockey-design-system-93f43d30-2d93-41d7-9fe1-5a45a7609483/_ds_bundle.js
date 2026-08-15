/* @ds-bundle: {"format":4,"namespace":"BarnLeagueHockeyDesignSystem_93f43d","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"BrushBanner","sourcePath":"components/display/BrushBanner.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Checklist","sourcePath":"components/display/Checklist.jsx"},{"name":"PhotoBand","sourcePath":"components/display/PhotoBand.jsx"},{"name":"SectionHeader","sourcePath":"components/display/SectionHeader.jsx"},{"name":"StarRule","sourcePath":"components/display/StarRule.jsx"},{"name":"StatRail","sourcePath":"components/display/StatRail.jsx"},{"name":"TeamCrest","sourcePath":"components/display/TeamCrest.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"FormSection","sourcePath":"components/forms/FormSection.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"c24bb0881758","components/core/Button.jsx":"867fb8f85f00","components/core/Icon.jsx":"befe4978c96e","components/core/IconButton.jsx":"1ed73aa0d2a1","components/core/Tag.jsx":"590f6e8280b7","components/display/BrushBanner.jsx":"e12442a1f385","components/display/Card.jsx":"c993c1ce736e","components/display/Checklist.jsx":"0dbf242abb32","components/display/PhotoBand.jsx":"62edd428e5d4","components/display/SectionHeader.jsx":"6f3dcfc87fcb","components/display/StarRule.jsx":"1d98fc150675","components/display/StatRail.jsx":"a6a42b069b82","components/display/TeamCrest.jsx":"3d3c834a84e9","components/forms/Checkbox.jsx":"ae2d4ed54121","components/forms/Field.jsx":"4b2c52df059d","components/forms/FormSection.jsx":"a403a3655844","components/forms/Input.jsx":"a69f7210f608","components/forms/RadioGroup.jsx":"90dc5f70b2c1","components/forms/Select.jsx":"e6a9bade5b25","components/forms/Textarea.jsx":"7ac84baeb6ae","ui_kits/forms/FormMasthead.jsx":"046194a331ce","ui_kits/forms/InsuranceRegistration.jsx":"dfd17164df30","ui_kits/forms/PlayerRegistration.jsx":"6ece5787a2a7","ui_kits/website/Hero.jsx":"c62605534771","ui_kits/website/RegisterSection.jsx":"9c3a78edd775","ui_kits/website/SeasonFacts.jsx":"0dbd14beb7f4","ui_kits/website/SiteFooter.jsx":"c1e0d9018d21","ui_kits/website/SiteHeader.jsx":"d1f168d26a63","ui_kits/website/Teams.jsx":"5f67d6251424","ui_kits/website/WhatToExpect.jsx":"f906f6f9e4b5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BarnLeagueHockeyDesignSystem_93f43d = window.BarnLeagueHockeyDesignSystem_93f43d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = "red",
  icon,
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `bl-badge bl-badge--${tone} ${className}`
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = "primary",
  size = "md",
  block = false,
  onDark = false,
  as = "button",
  iconBefore,
  iconAfter,
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const cls = ["bl-btn", `bl-btn--${variant}`, size !== "md" && `bl-btn--${size}`, block && "bl-btn--block", onDark && "bl-btn--onDark", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), iconBefore, /*#__PURE__*/React.createElement("span", null, children), iconAfter);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Font Awesome 6 Free (solid) glyph wrapper. The brand materials use solid,
   single-weight pictographs inside red discs; FA solid is the closest
   CDN-available match. Page must load the FA stylesheet. */
function Icon({
  name,
  size = 18,
  style,
  className = "",
  label,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("i", _extends({
    className: `fa-solid fa-${name} ${className}`,
    "aria-hidden": label ? undefined : true,
    "aria-label": label,
    role: label ? "img" : undefined,
    style: {
      fontSize: size,
      lineHeight: 1,
      display: "inline-block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  variant = "solid",
  shape = "circle",
  size = "md",
  onDark = false,
  className = "",
  ...rest
}) {
  const cls = ["bl-iconbtn", `bl-iconbtn--${variant}`, `bl-iconbtn--${shape}`, size !== "md" && `bl-iconbtn--${size}`, onDark && "bl-iconbtn--onDark", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    title: label
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  dot = false,
  filled = false,
  onDark = false,
  className = "",
  children,
  ...rest
}) {
  const cls = ["bl-tag", filled && "bl-tag--filled", onDark && "bl-tag--onDark", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "bl-tag__dot"
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/display/BrushBanner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BrushBanner({
  tone = "red",
  as = "div",
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `bl-brush${tone !== "red" ? ` bl-brush--${tone}` : ""} ${className}`
  }, rest), /*#__PURE__*/React.createElement("p", {
    className: "bl-brush__text"
  }, children));
}
Object.assign(__ds_scope, { BrushBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/BrushBanner.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  variant = "default",
  eyebrow,
  title,
  interactive = false,
  as = "div",
  className = "",
  children,
  ...rest
}) {
  const Tag = as;
  const cls = ["bl-card", variant !== "default" && `bl-card--${variant}`, interactive && "bl-card--interactive", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "bl-card__eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    className: "bl-card__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "bl-card__body"
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Checklist.jsx
try { (() => {
function Checklist({
  items = [],
  onDark = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("ul", {
    className: `bl-checklist${onDark ? " bl-checklist--onDark" : ""} ${className}`
  }, items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    className: "bl-checklist__item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-checklist__mark",
    "aria-hidden": "true"
  }, "\u2714"), /*#__PURE__*/React.createElement("span", null, it))));
}
Object.assign(__ds_scope, { Checklist });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Checklist.jsx", error: String((e && e.message) || e) }); }

// components/display/PhotoBand.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PhotoBand({
  src,
  alt = "",
  height = 320,
  scrim = "bottom",
  align = "left",
  className = "",
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `bl-photoband ${className}`,
    style: {
      height
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    className: "bl-photoband__img",
    src: src,
    alt: alt
  }), /*#__PURE__*/React.createElement("span", {
    className: `bl-photoband__scrim${scrim !== "bottom" ? ` bl-photoband__scrim--${scrim}` : ""}`
  }), children && /*#__PURE__*/React.createElement("div", {
    className: `bl-photoband__content${align === "center" ? " bl-photoband__content--center" : ""}`
  }, children));
}
Object.assign(__ds_scope, { PhotoBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/PhotoBand.jsx", error: String((e && e.message) || e) }); }

// components/display/SectionHeader.jsx
try { (() => {
function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "left",
  onDark = false,
  rule = true,
  className = ""
}) {
  const cls = ["bl-sectionhead", align === "center" && "bl-sectionhead--center", onDark && "bl-sectionhead--onDark", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("header", {
    className: cls
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "bl-sectionhead__eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "bl-sectionhead__title"
  }, title), rule && /*#__PURE__*/React.createElement("span", {
    className: "bl-sectionhead__rule"
  }), sub && /*#__PURE__*/React.createElement("p", {
    className: "bl-sectionhead__sub"
  }, sub));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/display/StarRule.jsx
try { (() => {
function StarRule({
  onDark = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bl-starrule${onDark ? " bl-starrule--onDark" : ""} ${className}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-starrule__line"
  }), /*#__PURE__*/React.createElement("span", {
    className: "bl-starrule__star"
  }, "\u2605"), /*#__PURE__*/React.createElement("span", {
    className: "bl-starrule__line"
  }));
}
Object.assign(__ds_scope, { StarRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StarRule.jsx", error: String((e && e.message) || e) }); }

// components/display/StatRail.jsx
try { (() => {
function StatRail({
  items = [],
  tone = "dark",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bl-statrail${tone === "light" ? " bl-statrail--light" : ""} ${className}`
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "bl-statrail__cell",
    key: i
  }, it.icon && /*#__PURE__*/React.createElement("span", {
    className: "bl-statrail__icon"
  }, it.icon), it.eyebrow && /*#__PURE__*/React.createElement("span", {
    className: "bl-statrail__eyebrow"
  }, it.eyebrow), it.headline && /*#__PURE__*/React.createElement("span", {
    className: "bl-statrail__headline"
  }, it.headline), it.note && /*#__PURE__*/React.createElement("span", {
    className: "bl-statrail__note"
  }, it.note))));
}
Object.assign(__ds_scope, { StatRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/StatRail.jsx", error: String((e && e.message) || e) }); }

// components/display/TeamCrest.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TeamCrest({
  team,
  logo,
  name,
  meta,
  interactive = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    "data-team": team,
    className: `bl-crest${interactive ? " bl-crest--interactive" : ""} ${className}`
  }, rest), logo && /*#__PURE__*/React.createElement("img", {
    className: "bl-crest__logo",
    src: logo,
    alt: `${name} crest`
  }), name && !logo && /*#__PURE__*/React.createElement("span", {
    className: "bl-crest__name"
  }, name), meta && /*#__PURE__*/React.createElement("span", {
    className: "bl-crest__meta"
  }, meta));
}
Object.assign(__ds_scope, { TeamCrest });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/TeamCrest.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  onDark = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: `bl-check${onDark ? " bl-check--onDark" : ""} ${className}`,
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "bl-check__box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-check__mark"
  }, "\u2714")), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
/** Label + control + help/error wrapper shared by every form control. */
function Field({
  label,
  hint,
  required = false,
  help,
  error,
  htmlFor,
  inline = false,
  className = "",
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bl-field${inline ? " bl-field--inline" : ""} ${className}`
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "bl-label",
    htmlFor: htmlFor
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "bl-label__req"
  }, "*"), hint && /*#__PURE__*/React.createElement("span", {
    className: "bl-label__hint"
  }, hint)), children, help && !error && /*#__PURE__*/React.createElement("span", {
    className: "bl-help"
  }, help), error && /*#__PURE__*/React.createElement("span", {
    className: "bl-error"
  }, error));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/FormSection.jsx
try { (() => {
function FormSection({
  title,
  icon,
  tone = "red",
  className = "",
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: className
  }, /*#__PURE__*/React.createElement("div", {
    className: `bl-formsection${tone === "dark" ? " bl-formsection--dark" : ""}`
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "bl-formsection__disc"
  }, icon), /*#__PURE__*/React.createElement("h3", {
    className: "bl-formsection__bar"
  }, title)), children);
}
Object.assign(__ds_scope, { FormSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FormSection.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  invalid = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: `bl-input ${className}`,
    "aria-invalid": invalid || undefined
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function RadioGroup({
  name,
  options = [],
  value,
  onChange,
  legend,
  stack = false,
  onDark = false,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      margin: 0,
      padding: 0,
      minWidth: 0
    },
    className: className
  }, legend && /*#__PURE__*/React.createElement("legend", {
    className: "bl-label",
    style: {
      padding: 0,
      marginBottom: "var(--space-2)"
    }
  }, legend), /*#__PURE__*/React.createElement("div", {
    className: `bl-choicegroup${stack ? " bl-choicegroup--stack" : ""}`
  }, options.map(o => {
    const val = typeof o === "string" ? o : o.value;
    const label = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("label", {
      key: val,
      className: `bl-check${onDark ? " bl-check--onDark" : ""}`,
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: val,
      checked: value !== undefined ? value === val : undefined,
      onChange: onChange ? () => onChange(val) : undefined
    }), /*#__PURE__*/React.createElement("span", {
      className: "bl-check__box bl-check__box--round"
    }, /*#__PURE__*/React.createElement("span", {
      className: "bl-check__dot"
    })), /*#__PURE__*/React.createElement("span", null, label));
  })));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  options = [],
  placeholder,
  className = "",
  children,
  value,
  ...rest
}) {
  const controlled = value !== undefined;
  return /*#__PURE__*/React.createElement("select", _extends({
    className: `bl-select ${className}`,
    value: controlled ? value : undefined,
    defaultValue: !controlled && placeholder ? "" : undefined
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), children || options.map(o => {
    const value = typeof o === "string" ? o : o.value;
    const label = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, label);
  }));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  invalid = false,
  rows = 4,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    className: `bl-textarea ${className}`,
    "aria-invalid": invalid || undefined
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/forms/FormMasthead.jsx
try { (() => {
const {
  Icon
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function FormMasthead({
  crest,
  title,
  strip,
  team,
  bullets
}) {
  return /*#__PURE__*/React.createElement("header", {
    "data-team": team
  }, /*#__PURE__*/React.createElement("div", {
    className: "masthead"
  }, /*#__PURE__*/React.createElement("img", {
    className: "masthead__bg",
    src: "../../assets/photo-stick-puck.jpg",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "masthead__inner"
  }, /*#__PURE__*/React.createElement("img", {
    className: "masthead__crest",
    src: crest,
    alt: "Barn League Hockey"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "masthead__kicker"
  }, "Still love ", /*#__PURE__*/React.createElement("em", null, "the game?")), /*#__PURE__*/React.createElement("span", {
    className: "masthead__sodowe"
  }, "So do we."), /*#__PURE__*/React.createElement("h1", {
    className: "masthead__title"
  }, title), bullets && /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: "var(--space-4) 0 0",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, bullets.map(([icon, text]) => /*#__PURE__*/React.createElement("li", {
    key: text,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      color: "var(--bone-200)",
      fontFamily: "var(--font-label)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: ".05em",
      fontSize: "var(--text-label)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--team-accent,var(--red-500))",
      width: 18,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 15
  })), text)))))), /*#__PURE__*/React.createElement("p", {
    className: "masthead__strip",
    style: {
      margin: 0
    }
  }, strip));
}
Object.assign(window, {
  FormMasthead
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/forms/FormMasthead.jsx", error: String((e && e.message) || e) }); }

// ui_kits/forms/InsuranceRegistration.jsx
try { (() => {
const {
  FormSection,
  Field,
  Input,
  Select,
  Checklist,
  Button,
  Icon
} = window.BarnLeagueHockeyDesignSystem_93f43d;
const INSURANCE_TEAMS = [{
  key: "shockers",
  label: "Shockers",
  crest: "../../assets/team-shockers.png"
}, {
  key: "hornets",
  label: "Hornets",
  crest: "../../assets/team-hornets.png"
}, {
  key: "rockets",
  label: "Rockets",
  crest: "../../assets/team-rockets.png"
}];
function InsuranceRegistration() {
  const [team, setTeam] = React.useState("shockers");
  const current = INSURANCE_TEAMS.find(t => t.key === team);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "team-switch"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--bone-500)",
      marginRight: 6
    }
  }, "Team edition"), INSURANCE_TEAMS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    className: "team-switch__btn",
    "aria-pressed": team === t.key,
    onClick: () => setTeam(t.key)
  }, t.label))), /*#__PURE__*/React.createElement("div", {
    className: "form-doc",
    "data-team": team
  }, /*#__PURE__*/React.createElement(FormMasthead, {
    team: team,
    crest: current.crest,
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Insurance", /*#__PURE__*/React.createElement("br", null), "registration form"),
    strip: "Please complete all fields. This information is required for league administration and insurance purposes."
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-body"
  }, /*#__PURE__*/React.createElement(FormSection, {
    title: "Player information",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 17
    }),
    tone: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    htmlFor: "i-first",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-first"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    htmlFor: "i-last",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-last"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Date of birth",
    hint: "(YYYY-MM-DD)",
    htmlFor: "i-dob",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-dob"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Phone number",
    htmlFor: "i-phone",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-phone",
    type: "tel"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "i-email",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-email",
    type: "email"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Current team",
    hint: "(if applicable)",
    htmlFor: "i-team"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "i-team",
    placeholder: "Choose one",
    options: ["Shockers", "Hornets", "Rockets", "Not yet placed"]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Team role / position",
    hint: "(if applicable)",
    htmlFor: "i-role"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-role"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--space-8)"
    }
  }), /*#__PURE__*/React.createElement(FormSection, {
    title: "Contact information",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "phone",
      size: 17
    }),
    tone: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Emergency contact name",
    htmlFor: "i-ec",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-ec"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Relationship to player",
    htmlFor: "i-rel"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-rel"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Emergency contact phone number",
    htmlFor: "i-ecp",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-ecp",
    type: "tel"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Emergency contact email",
    hint: "(optional)",
    htmlFor: "i-ece"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-ece",
    type: "email"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Mailing address",
    htmlFor: "i-addr"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-addr"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row-3"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "City",
    htmlFor: "i-city"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-city"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Province",
    htmlFor: "i-prov"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-prov",
    defaultValue: "ON"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Postal code",
    htmlFor: "i-post"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-post"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "var(--space-8)"
    }
  }), /*#__PURE__*/React.createElement(FormSection, {
    title: "Player acknowledgement",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "shield-halved",
      size: 17
    }),
    tone: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ack"
  }, /*#__PURE__*/React.createElement(Checklist, {
    items: ["I confirm that the information provided on this form is accurate and complete.", "I understand that this information will be used for league administration and to obtain insurance coverage for Barn League Hockey.", "I authorize Barn League Hockey to collect, use, and disclose this information to our insurance provider as required for coverage.", "I understand that insurance coverage is provided for registered players only and is subject to the terms and conditions of the league's insurance policy.", "I agree to abide by all league rules and policies. I acknowledge that participation in hockey involves inherent risks of injury."]
  }), /*#__PURE__*/React.createElement("div", {
    className: "sign-row"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Player signature",
    htmlFor: "i-sig"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-sig"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Date",
    hint: "(YYYY-MM-DD)",
    htmlFor: "i-date"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "i-date"
  })), /*#__PURE__*/React.createElement("div", null))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    iconAfter: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Submit insurance form")))), /*#__PURE__*/React.createElement("div", {
    className: "form-footer"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: "var(--team-accent)",
      color: "var(--ink-900)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "envelope",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      display: "block",
      color: "var(--bone-500)"
    }
  }, "Return completed form to"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:barnleaguehockey@gmail.com"
  }, "barnleaguehockey@gmail.com")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      color: "var(--team-accent)",
      fontSize: 20
    }
  }, "\u2605"))));
}
Object.assign(window, {
  InsuranceRegistration,
  INSURANCE_TEAMS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/forms/InsuranceRegistration.jsx", error: String((e && e.message) || e) }); }

// ui_kits/forms/PlayerRegistration.jsx
try { (() => {
const {
  FormSection,
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Button,
  Icon,
  Badge,
  Card
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function PlayerRegistration() {
  const [sent, setSent] = React.useState(false);
  const [deposit, setDeposit] = React.useState("Pending");
  return /*#__PURE__*/React.createElement("div", {
    className: "form-doc"
  }, /*#__PURE__*/React.createElement(FormMasthead, {
    crest: "../../assets/logo-barn-league-hockey.png",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "New player", /*#__PURE__*/React.createElement("br", null), "registration form"),
    strip: "Please complete all fields. This information helps us build balanced teams, communicate league information and meet insurance requirements.",
    bullets: [["user-shield", "Good hockey"], ["handshake", "Good people"], ["face-smile", "Good laughs"], ["trophy", "Friendly competition"]]
  }), sent ? /*#__PURE__*/React.createElement("div", {
    className: "sent"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 999,
      background: "var(--red-600)",
      color: "var(--bone-100)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check",
    size: 30
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "Registration received"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: "52ch",
      margin: 0
    }
  }, "Once your registration information and deposit have been received, a confirmation email will be sent with season information, schedule details, team placement and more important league updates."), /*#__PURE__*/React.createElement(Badge, {
    tone: deposit === "Yes" ? "ok" : "pending"
  }, "Deposit ", deposit === "Yes" ? "paid" : "pending"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => setSent(false)
  }, "Back to the form")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "form-body form-cols"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(FormSection, {
    title: "Player information",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 17
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    htmlFor: "p-first",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-first"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    htmlFor: "p-last",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-last"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Date of birth",
    hint: "(YYYY-MM-DD)",
    htmlFor: "p-dob",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-dob",
    placeholder: "1988-04-12"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Phone number",
    htmlFor: "p-phone",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-phone",
    type: "tel"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "p-email",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-email",
    type: "email"
  }))))), /*#__PURE__*/React.createElement(FormSection, {
    title: "Connections",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 17
    }),
    tone: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "knows",
    legend: "Do you know anyone currently in the league?",
    options: ["Yes", "No"]
  }), /*#__PURE__*/React.createElement(Field, {
    label: "If yes, please list their name(s)",
    htmlFor: "p-names"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-names"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Is there anyone you would prefer to play on the same team with?",
    htmlFor: "p-prefer"
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "p-prefer",
    rows: 2
  })), /*#__PURE__*/React.createElement("p", {
    className: "note",
    style: {
      margin: 0
    }
  }, "*We will consider requests when building teams, but cannot guarantee that players will be placed together. Our priority is creating balanced and competitive teams.")))), /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(FormSection, {
    title: "Hockey experience",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "hockey-puck",
      size: 17
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "level",
    legend: "Highest level of hockey played",
    options: ["Learn to play / beginner", "House league / recreational", "Select / rep / travel", "Junior / senior / college / other"]
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "pos1",
    legend: "Primary position",
    options: ["Forward", "Defence", "Goaltender", "No preference"]
  }), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "pos2",
    legend: "Secondary position (if applicable)",
    options: ["Forward", "Defence", "Goaltender", "No preference"]
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-row-2"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Years played",
    htmlFor: "p-years"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "p-years",
    placeholder: "Choose one",
    options: ["Under 5", "5-10", "10-20", "20+"]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Since you played regularly",
    htmlFor: "p-since"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "p-since",
    placeholder: "Choose one",
    options: ["Still playing", "Under 2 years", "2-5 years", "5+ years"]
  }))), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "ability",
    legend: "How would you rate your current playing ability?",
    options: ["Beginner", "Recreational", "Intermediate", "Experienced", "Advanced"]
  }))), /*#__PURE__*/React.createElement(FormSection, {
    title: "Availability & intentions",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-days",
      size: 17
    }),
    tone: "dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-stack"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "often",
    legend: "How often do you plan to participate?",
    options: ["Every week / almost every week", "Most weeks", "Approximately half the season", "Occasional / spare player"]
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Yes \u2014 contact me as a spare when another team is short players",
    defaultChecked: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "deposit-band bl-grain"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "$100 deposit to secure your spot"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 var(--space-3)"
    }
  }, "A $100 deposit is required to claim your position for the league."), /*#__PURE__*/React.createElement("p", {
    className: "note",
    style: {
      color: "var(--red-400)",
      margin: "0 0 var(--space-4)"
    }
  }, "Your spot is not confirmed until the deposit is received."), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "deposit",
    legend: "Deposit paid",
    onDark: true,
    options: ["Yes", "Pending"],
    value: deposit,
    onChange: setDeposit
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--bone-500)"
    }
  }, "E-transfer for deposit \u2014 please send your $100 deposit to"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-2) 0 var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    className: "on-dark",
    href: "mailto:HughTylerShannon@gmail.com",
    style: {
      fontSize: "1.25rem",
      fontWeight: 700
    }
  }, "HughTylerShannon@gmail.com")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--bone-300)"
    }
  }, "Once your registration information and deposit have been received, a confirmation email will be sent with season information, schedule details, team placement and more important league updates."))), /*#__PURE__*/React.createElement("div", {
    className: "form-body"
  }, /*#__PURE__*/React.createElement(FormSection, {
    title: "Player acknowledgement",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "shield-halved",
      size: 17
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "ack"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "I confirm that the information provided is accurate. I understand that Barn League Hockey will use player experience, position, availability and other relevant information when creating teams with the goal of keeping the league as balanced and enjoyable as possible."), /*#__PURE__*/React.createElement("div", {
    className: "sign-row"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Signature",
    htmlFor: "p-sig"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-sig"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Printed name",
    htmlFor: "p-print"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-print"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Date",
    htmlFor: "p-date"
  }, /*#__PURE__*/React.createElement(Input, {
    id: "p-date",
    placeholder: "2026-08-15"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)",
      display: "flex",
      gap: "var(--space-4)",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: () => setSent(true),
    iconAfter: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Submit registration"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Download the PDF instead")))), /*#__PURE__*/React.createElement("div", {
    className: "form-footer"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      background: "var(--red-600)",
      color: "var(--bone-100)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "envelope",
    size: 18
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      display: "block",
      color: "var(--bone-500)"
    }
  }, "Questions or ready to join? Email us today"), /*#__PURE__*/React.createElement("a", {
    href: "mailto:barnleaguehockey@gmail.com"
  }, "barnleaguehockey@gmail.com")))));
}
Object.assign(window, {
  PlayerRegistration
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/forms/PlayerRegistration.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
const {
  Button,
  Tag,
  Icon,
  BrushBanner
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    id: "league",
    className: "hero"
  }, /*#__PURE__*/React.createElement("img", {
    className: "hero__bg",
    src: "../../assets/photo-faceoff.jpg",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    className: "hero__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "site-wrap hero__inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--red-400)",
      letterSpacing: "var(--tracking-micro)"
    }
  }, "3 founding teams. 1 league. Lots of great hockey."), /*#__PURE__*/React.createElement("h1", null, "Adult rec", /*#__PURE__*/React.createElement("br", null), "hockey league"), /*#__PURE__*/React.createElement("p", {
    className: "hero__lead"
  }, "Built on 20+ years of hockey, friendship and good competition. Sundays at the Palmerston Arena, September 2026 through March 2027."), /*#__PURE__*/React.createElement("div", {
    className: "hero__ctas"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    as: "a",
    href: "#register",
    iconAfter: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Register for the season"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onDark: true,
    as: "a",
    href: "#season"
  }, "See how it runs")), /*#__PURE__*/React.createElement("div", {
    className: "hero__tags"
  }, /*#__PURE__*/React.createElement(Tag, {
    onDark: true,
    dot: true
  }, "Sundays"), /*#__PURE__*/React.createElement(Tag, {
    onDark: true
  }, "All skill levels"), /*#__PURE__*/React.createElement(Tag, {
    onDark: true
  }, "Goalies always welcome"), /*#__PURE__*/React.createElement(Tag, {
    onDark: true
  }, "Spares welcome"))), /*#__PURE__*/React.createElement("img", {
    className: "hero__shield",
    src: "../../assets/logo-barn-shield.png",
    alt: "The Barn League"
  })), /*#__PURE__*/React.createElement(BrushBanner, {
    as: "div"
  }, "Real hockey. Real people. Real fun."));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/RegisterSection.jsx
try { (() => {
const {
  SectionHeader,
  Field,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  Button,
  Card,
  Icon,
  Badge,
  Textarea
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function RegisterSection() {
  const [sent, setSent] = React.useState(false);
  const [position, setPosition] = React.useState("Forward");
  const [form, setForm] = React.useState({
    first: "",
    last: "",
    email: "",
    level: ""
  });
  const set = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const submit = e => {
    e.preventDefault();
    setSent(true);
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "register",
    className: "site-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "New player registration",
    title: "Still love the game? So do we.",
    sub: "Complete the short form and we'll send the full registration package, schedule details and team placement."
  }), /*#__PURE__*/React.createElement("div", {
    className: "register"
  }, sent ? /*#__PURE__*/React.createElement(Card, {
    variant: "plate",
    eyebrow: "Registration received",
    title: "You're on the list"
  }, /*#__PURE__*/React.createElement("p", null, "Thanks ", form.first || "there", " \u2014 we'll email ", form.email || "you", " with season information, schedule details and team placement."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginBottom: 0
    }
  }, "Your spot is not confirmed until the $100 deposit is received. E-transfer it to", " ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:HughTylerShannon@gmail.com"
  }, "HughTylerShannon@gmail.com"), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)",
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "pending"
  }, "Deposit pending"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setSent(false)
  }, "Edit my answers"))) : /*#__PURE__*/React.createElement("form", {
    className: "register__form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "register__row"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    htmlFor: "first",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "first",
    value: form.first,
    onChange: set("first"),
    required: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    htmlFor: "last",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "last",
    value: form.last,
    onChange: set("last"),
    required: true
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Email address",
    htmlFor: "email",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    id: "email",
    type: "email",
    value: form.email,
    onChange: set("email"),
    required: true
  })), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "position",
    legend: "Primary position",
    value: position,
    onChange: setPosition,
    options: ["Forward", "Defence", "Goaltender", "No preference"]
  }), /*#__PURE__*/React.createElement(Field, {
    label: "How would you rate your current playing ability?",
    htmlFor: "level"
  }, /*#__PURE__*/React.createElement(Select, {
    id: "level",
    placeholder: "Choose one",
    value: form.level,
    onChange: set("level"),
    options: ["Beginner", "Recreational", "Intermediate", "Experienced", "Advanced"]
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Anyone you'd prefer to play with?",
    htmlFor: "prefer",
    help: "We consider requests, but our priority is creating balanced and competitive teams."
  }, /*#__PURE__*/React.createElement(Textarea, {
    id: "prefer",
    rows: 2,
    placeholder: "Names, one per line"
  })), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Contact me as a spare when another team is short players",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    type: "submit",
    iconAfter: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 14
    })
  }, "Send my registration")), /*#__PURE__*/React.createElement("div", {
    className: "deposit"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--text-accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dollar-sign",
    size: 12
  }), " $100 deposit to secure your spot"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "A $100 deposit is required to claim your position for the league.", " ", /*#__PURE__*/React.createElement("strong", null, "Your spot is not confirmed until the deposit is received.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "E-transfer to ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:HughTylerShannon@gmail.com"
  }, "HughTylerShannon@gmail.com"), ". Once your registration and deposit are received you'll get a confirmation email with season information, schedule details, team placement and league updates."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Questions? ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:barnleaguehockey@gmail.com"
  }, "barnleaguehockey@gmail.com"))))));
}
Object.assign(window, {
  RegisterSection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/RegisterSection.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SeasonFacts.jsx
try { (() => {
const {
  StatRail,
  Icon,
  SectionHeader
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function SeasonFacts() {
  const items = [{
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "calendar-days",
      size: 30
    }),
    eyebrow: "Season starts",
    headline: "September 2026",
    note: "Runs through March 2027"
  }, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "warehouse",
      size: 30
    }),
    eyebrow: "Gameplay on",
    headline: "Sundays",
    note: "At the Palmerston Arena"
  }, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "hockey-puck",
      size: 30
    }),
    eyebrow: "Over 60 minutes",
    headline: "Of gameplay",
    note: "Per game, full ice"
  }, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "user-shield",
      size: 30
    }),
    eyebrow: "Goalies",
    headline: "Always welcome",
    note: "Gear-friendly scheduling"
  }, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "users",
      size: 30
    }),
    eyebrow: "Full-season players",
    headline: "& spares welcome",
    note: "Play weekly or fill in"
  }, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "handshake",
      size: 30
    }),
    eyebrow: "Join",
    headline: "Solo or as a group",
    note: "Individually, with friends"
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "season",
    className: "dark-section bl-grain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap",
    style: {
      paddingTop: "var(--section-y)"
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    onDark: true,
    eyebrow: "How the season runs",
    title: "One night a week, all winter",
    sub: "Twelve regular-season Sundays plus playoffs. Balanced teams, real refs, and a room that stays friendly."
  })), /*#__PURE__*/React.createElement(StatRail, {
    items: items
  }));
}
Object.assign(window, {
  SeasonFacts
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SeasonFacts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteFooter.jsx
try { (() => {
const {
  Button,
  IconButton,
  Icon,
  StarRule
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer bl-grain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-footer__top"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-barn-shield.png",
    alt: "The Barn League",
    style: {
      height: 108,
      width: "auto"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--bone-500)"
    }
  }, "Questions or ready to join? Email us today"), /*#__PURE__*/React.createElement("a", {
    className: "site-footer__mail",
    href: "mailto:barnleaguehockey@gmail.com"
  }, "barnleaguehockey@gmail.com")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: "var(--space-3)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "envelope"
    }),
    label: "Email the league"
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "file-lines"
    }),
    label: "Download the registration form",
    variant: "outline"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onDark: true,
    as: "a",
    href: "#register"
  }, "Register"))), /*#__PURE__*/React.createElement("p", {
    className: "site-footer__slogan"
  }, "\u2605 We all work tomorrow. \u2605"), /*#__PURE__*/React.createElement(StarRule, {
    onDark: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "site-footer__fine"
  }, /*#__PURE__*/React.createElement("span", null, "Barn League Hockey \xB7 Palmerston Arena \xB7 Sundays"), /*#__PURE__*/React.createElement("span", null, "Season 2026 \u2013 2027"))));
}
Object.assign(window, {
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteHeader.jsx
try { (() => {
const {
  Button,
  Icon
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function SiteHeader() {
  const links = [["The league", "league"], ["Season", "season"], ["Teams", "teams"], ["Register", "register"]];
  const [active, setActive] = React.useState("league");
  const go = id => e => {
    e.preventDefault();
    setActive(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({
      top: el.offsetTop - 72,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap site-header__inner"
  }, /*#__PURE__*/React.createElement("img", {
    className: "site-header__mark",
    src: "../../assets/logo-barn-league-hockey.png",
    alt: "Barn League Hockey"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "site-nav"
  }, links.map(([label, id]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: "#" + id,
    "aria-current": active === id ? "true" : undefined,
    onClick: go(id)
  }, label)), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    as: "a",
    href: "#register",
    onClick: go("register"),
    iconBefore: /*#__PURE__*/React.createElement(Icon, {
      name: "envelope",
      size: 13
    })
  }, "Join the league"))));
}
Object.assign(window, {
  SiteHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Teams.jsx
try { (() => {
const {
  TeamCrest,
  SectionHeader,
  Card,
  StarRule,
  Badge
} = window.BarnLeagueHockeyDesignSystem_93f43d;
const TEAMS = [{
  key: "shockers",
  name: "Shockers",
  logo: "../../assets/team-shockers.png",
  blurb: "Navy and orange. Founding team, deepest bench in the league."
}, {
  key: "hornets",
  name: "Hornets",
  logo: "../../assets/team-hornets.png",
  blurb: "Forest green and gold. Founding team, best power play."
}, {
  key: "rockets",
  name: "Rockets",
  logo: "../../assets/team-rockets.png",
  blurb: "Black and orange. Founding team, fastest first line."
}];
function Teams() {
  const [selected, setSelected] = React.useState("shockers");
  const team = TEAMS.find(t => t.key === selected);
  return /*#__PURE__*/React.createElement("section", {
    id: "teams",
    className: "dark-section bl-grain site-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    onDark: true,
    eyebrow: "3 founding teams",
    title: "Pick a room, or let us place you",
    sub: "Tell us who you'd like to play with on your registration form. We consider every request, but our priority is balanced, competitive teams."
  }), /*#__PURE__*/React.createElement("div", {
    className: "teams-grid"
  }, TEAMS.map(t => /*#__PURE__*/React.createElement(TeamCrest, {
    key: t.key,
    team: t.key,
    logo: t.logo,
    name: t.name,
    meta: selected === t.key ? "Selected" : "Founding team",
    interactive: true,
    onClick: () => setSelected(t.key),
    style: selected === t.key ? {
      boxShadow: "var(--shadow-lift)",
      outline: "3px solid var(--team-accent)"
    } : undefined
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(StarRule, {
    onDark: true
  })), /*#__PURE__*/React.createElement("div", {
    "data-team": selected,
    style: {
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "dark",
    eyebrow: team.name,
    title: "Team notes"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, team.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)",
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "red"
  }, "Spots open"), /*#__PURE__*/React.createElement(Badge, {
    tone: "bone"
  }, "Spares needed"))))));
}
Object.assign(window, {
  Teams,
  TEAMS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Teams.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WhatToExpect.jsx
try { (() => {
const {
  Card,
  Checklist,
  SectionHeader,
  Icon,
  Button,
  Badge
} = window.BarnLeagueHockeyDesignSystem_93f43d;
function WhatToExpect() {
  return /*#__PURE__*/React.createElement("section", {
    className: "site-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "site-wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    eyebrow: "What to expect",
    title: "A league built for guys who love the game",
    sub: "Competitive, respectful and fun. Skill levels are mixed on purpose, and teams are balanced before the season starts."
  }), /*#__PURE__*/React.createElement("div", {
    className: "expect"
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "plate"
  }, /*#__PURE__*/React.createElement(Checklist, {
    items: ["Competitive, respectful, and fun environment", "All skill levels welcome", "Strong focus on sportsmanship", "A league built for guys who love the game", "We all work tomorrow."]
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "paper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fees"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bl-eyebrow",
    style: {
      color: "var(--text-accent)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dollar-sign",
    size: 12
  }), " Affordable league fees"), /*#__PURE__*/React.createElement("span", {
    className: "fees__amount"
  }, "$100 deposit"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "A $100 deposit secures your spot. Final cost is determined by total registration \u2014 send us a message to learn more."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "ok",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 11
    })
  }, "Insurance included"), /*#__PURE__*/React.createElement(Badge, {
    tone: "dark"
  }, "E-transfer accepted")), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    as: "a",
    href: "#register",
    iconAfter: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 13
    })
  }, "Start your registration"))))));
}
Object.assign(window, {
  WhatToExpect
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WhatToExpect.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.BrushBanner = __ds_scope.BrushBanner;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Checklist = __ds_scope.Checklist;

__ds_ns.PhotoBand = __ds_scope.PhotoBand;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StarRule = __ds_scope.StarRule;

__ds_ns.StatRail = __ds_scope.StatRail;

__ds_ns.TeamCrest = __ds_scope.TeamCrest;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.FormSection = __ds_scope.FormSection;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
