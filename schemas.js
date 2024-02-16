import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

// Adding HTML sanitization to joi
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML.",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

// Allows passwords with at least 1 number, 1 capital letter, 1 lowercase letter
// and 8-20 characters long. Whitespace characters other than space are not allowed
// const password = /^(?=.*\d)(?=.*\p{Lu})(?=.*\p{Ll})([\S ]){8,20}$/u;
const password = /^[\S ]{4,20}$/u; // weak version for development

// Allows unicode letters, spaces, commas, dots, hyphens and dashes
const name = /^[\p{L} ,.'’-]*$/u;

// Allows 0-6 digits in the integer part, a comma or a dot and 1-2 digits in the decimal part
// const priceRegex = /^\d{0,6}(?:[,.]\d{1,2}|$)$/

// Allows any non-whitespace unicode characters and spaces
const generic = /^[\S ]*$/u;

export const newUserSchema = Joi.object({
    name: Joi.string().pattern(name).max(50).required(),
    surname: Joi.string().pattern(name).max(50).required(),
    username: Joi.string().pattern(generic).max(50).required().escapeHTML(),
    password: Joi.string().pattern(password).required().messages({
        "string.pattern.base": "Ο κωδικός πρέπει να είναι 4-20 χαρακτήρες.",
        "string.empty": "Ο κωδικός δε μπορεί να είναι κενός.",
        "any.required": "Ο κωδικός είναι απαραίτητος.",
    }),
    email: Joi.string().email().max(255).required(),
    role: Joi.string().valid("user", "product seller", "admin").required(),
});

export const editUserSchema = Joi.object({
    name: Joi.string().pattern(name).max(50).allow("", null),
    surname: Joi.string().pattern(name).max(50).allow("", null),
    username: Joi.string().pattern(generic).max(50).allow("", null).escapeHTML(),
    email: Joi.string().email().max(255).allow("", null),
    role: Joi.string().valid("user", "product seller", "admin").allow("", null),
});

export const newProductSchema = Joi.object({
    name: Joi.string().pattern(generic).max(100).required().escapeHTML(),
    code: Joi.string().pattern(generic).max(50).required().escapeHTML(),
    price: Joi.number().min(0.01).max(999999.99).precision(2).required(),
    category: Joi.string().pattern(generic).max(50).required().escapeHTML(),
});

export const editProductSchema = Joi.object({
    name: Joi.string().pattern(generic).max(100).allow("", null).escapeHTML(),
    code: Joi.string().pattern(generic).max(50).allow("", null).escapeHTML(),
    price: Joi.number().min(0.01).max(999999.99).precision(2).allow("", null),
    category: Joi.string().pattern(generic).max(50).allow("", null).escapeHTML(),
});
