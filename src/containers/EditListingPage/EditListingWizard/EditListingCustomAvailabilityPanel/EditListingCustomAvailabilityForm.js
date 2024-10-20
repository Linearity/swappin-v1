import React, { useState } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

// Import configs and util modules
import { intlShape, injectIntl, FormattedMessage } from '../../../../util/reactIntl';
import { propTypes } from '../../../../util/types';
import {
  END_DATE,
  START_DATE,
  getStartOf,
  initialVisibleMonth,
  isInRange,
  isSameDay,
  stringifyDateToISO8601,
  timeOfDayFromLocalToTimeZone,
  timeOfDayFromTimeZoneToLocal,
  monthIdString,
} from '../../../../util/dates';

// Import shared components
import { Button, Form, FieldTextInput, FieldDateRangeInput } from '../../../../components';

// Import modules from this directory
import css from './EditListingCustomAvailabilityForm.module.css';

const isOutsideRange = timeZone => focusedInput => day => {
  // 'day' is pointing to browser's local time-zone (react-dates gives these).
  // However, exceptionStartDay and other times refer to listing's timeZone.
  const localizedDay = timeOfDayFromLocalToTimeZone(day, timeZone);
  const rangeStart = getStartOf(TODAY, 'day', timeZone);
  const rangeEnd = getStartOf(rangeStart, 'day', timeZone, MAX_RANGE_FOR_EXCEPTIONS, 'days');
  // past days and days on next year are outside of actionable availability range.
  const isOutsideRange = !isInRange(localizedDay, rangeStart, rangeEnd);
  return isOutsideRange;
};

const handleFocusedInputChange = setFocusedInput => focusedInput => {
  setFocusedInput(focusedInput);
};

// Format form's value for the react-dates input: convert timeOfDay to the local time
const formatFieldDateInput = timeZone => v => {
  const { startDate, endDate } = v || {};
  // Format the Final Form field's value for the DateRangeInput
  // DateRangeInput operates on local time zone, but the form uses listing's time zone
  const formattedStart = startDate ? timeOfDayFromTimeZoneToLocal(startDate, timeZone) : startDate;
  const formattedEnd = endDate ? timeOfDayFromTimeZoneToLocal(endDate, timeZone) : endDate;
  return v ? { startDate: formattedStart, endDate: formattedEnd } : v;
};

// Parse react-dates input's value: convert timeOfDay to the given time zone
const parseFieldDateInput = timeZone => v => {
  const { startDate, endDate } = v || {};
  // Parse the DateRangeInput's value (local noon) for the Final Form
  // The form expects listing's time zone and start of day aka 00:00
  const parsedStart = startDate
    ? getStartOf(timeOfDayFromLocalToTimeZone(startDate, timeZone), 'day', timeZone)
    : startDate;
  const parsedEnd = endDate
    ? getStartOf(timeOfDayFromLocalToTimeZone(endDate, timeZone), 'day', timeZone)
    : endDate;
  return v ? { startDate: parsedStart, endDate: parsedEnd } : v;
};

// Date formatting used for placeholder texts:
const dateFormattingOptions = { month: 'short', day: 'numeric', weekday: 'short' };

const TODAY = new Date();
const MAX_RANGE_FOR_EXCEPTIONS = 366;

export const EditListingCustomAvailabilityFormComponent = props => (
  <FinalForm
    {...props}
    render={formRenderProps => {
      const {
        formId,
        autoFocus,
        className,
        disabled,
        ready,
        handleSubmit,
        intl,
        invalid,
        pristine,
        saveActionMsg,
        timeZone,
        updated,
        updateInProgress,
        fetchErrors,
      } = formRenderProps;

      const idPrefix = `${formId}` || 'EditListingCustomAvailabilityForm';
      const classes = classNames(css.root, className);
      const submitReady = (updated && pristine) || ready;
      const submitInProgress = updateInProgress;
      const submitDisabled = invalid || disabled || submitInProgress;
      const { updateListingError, showListingsError } = fetchErrors || {};

      const [focusedInput, setFocusedInput] = useState(null);

      return (
        <Form onSubmit={handleSubmit} className={classes}>
          {updateListingError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingCustomAvailabilityForm.updateFailed" />
            </p>
          ) : null}
          {showListingsError ? (
            <p className={css.error}>
              <FormattedMessage id="EditListingCustomAvailabilityForm.showListingFailed" />
            </p>
          ) : null}
          <FieldDateRangeInput
            className={css.fieldDateInput}
            name="exceptionRange"
            isDaily={false}
            startDateId={`${idPrefix}.exceptionStartDate`}
            startDateLabel={intl.formatMessage({
              id: 'EditListingCustomAvailabilityForm.startDateLabel',
            })}
            startDatePlaceholderText={intl.formatDate(TODAY, dateFormattingOptions)}
            endDateId={`${idPrefix}.exceptionEndDate`}
            endDateLabel={intl.formatMessage({
              id: 'EditListingCustomAvailabilityForm.endDateLabel',
            })}
            endDatePlaceholderText={intl.formatDate(TODAY, dateFormattingOptions)}
            focusedInput={focusedInput}
            onFocusedInputChange={handleFocusedInputChange(setFocusedInput)}
            format={formatFieldDateInput(timeZone)}
            parse={parseFieldDateInput(timeZone)}
            // validate={composeValidators(
            //   required(
            //     intl.formatMessage({
            //       id: 'BookingDatesForm.requiredDate',
            //     })
            //   ),
            //   bookingDatesRequired(
            //     intl.formatMessage({
            //       id: 'FieldDateRangeInput.invalidStartDate',
            //     }),
            //     intl.formatMessage({
            //       id: 'FieldDateRangeInput.invalidEndDate',
            //     })
            //   )
            // )}
            // initialVisibleMonth={initialVisibleMonth(exceptionStartDay || startOfToday, timeZone)}
            // navNext={
            //   <Next
            //     showUntilDate={endOfAvailabilityExceptionRange(timeZone, TODAY)}
            //     startOfNextRange={getStartOfNextMonth(currentMonth, timeZone)}
            //   />
            // }
            // navPrev={
            //   <Prev
            //     showUntilDate={getStartOf(TODAY, 'month', timeZone)}
            //     startOfPrevRange={getStartOf(currentMonth, 'month', timeZone, -1, 'months')}
            //   />
            // }
            // onPrevMonthClick={() => onMonthClick(getStartOfPrevMonth)}
            // onNextMonthClick={() => onMonthClick(getStartOfNextMonth)}
            // isDayBlocked={isDayBlocked({
            //   exceptionStartDay,
            //   exceptionEndDay,
            //   availableDates,
            //   isDaily,
            //   timeZone,
            // })}
            isOutsideRange={isOutsideRange(timeZone)}
            // isBlockedBetween={isBlockedBetween(availableDates, isDaily, timeZone)}
            // onClose={event =>
            //   setCurrentMonth(getStartOf(event?.startDate ?? startOfToday, 'month', timeZone))
            // }
            useMobileMargins
          />

          <Button
            className={css.submitButton}
            type="submit"
            inProgress={submitInProgress}
            disabled={submitDisabled}
            ready={submitReady}
          >
            {saveActionMsg}
          </Button>
        </Form>
      );
    }}
  />
);

EditListingCustomAvailabilityFormComponent.defaultProps = {
  fetchErrors: null,
  formId: 'EditListingCustomAvailabilityForm',
};

EditListingCustomAvailabilityFormComponent.propTypes = {
  formId: string,
  intl: intlShape.isRequired,
  onSubmit: func.isRequired,
  saveActionMsg: string.isRequired,
  disabled: bool.isRequired,
  ready: bool.isRequired,
  updated: bool.isRequired,
  updateInProgress: bool.isRequired,
  fetchErrors: shape({
    showListingsError: propTypes.error,
    updateListingError: propTypes.error,
  }),
};

export default compose(injectIntl)(EditListingCustomAvailabilityFormComponent);
