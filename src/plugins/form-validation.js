import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Text is required',
    required: 'Text is required',
  },
  string: {
    max: 'You can’t enter more than ${max} characters',
    required: 'Text is required',
  },
  number: {
    required: 'Text is required',
  },
});
