import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Import configs and util modules
import { FormattedMessage } from '../../../../util/reactIntl';
import { LISTING_STATE_DRAFT } from '../../../../util/types';
import { getDefaultTimeZoneOnBrowser } from '../../../../util/dates';
import { types as sdkTypes } from '../../../../util/sdkLoader';
import { DAY, isFullDay } from '../../../../transactions/transaction';

// Import shared components
import { H3, ListingLink } from '../../../../components';

// Import modules from this directory
import EditListingCustomAvailabilityForm from './EditListingCustomAvailabilityForm';
import css from './EditListingCustomAvailabilityPanel.module.css';

const getInitialValues = params => {
  const { allExceptions } = params;
  const { start, end } = allExceptions.length > 0 ? allExceptions[0].attributes : {};
  const exceptionRange = { startDate: start, endDate: end }

  return { exceptionRange };
};


const EditListingCustomAvailabilityPanel = props => {
  const {
    allExceptions,
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onAddAvailabilityException,
    onDeleteAvailabilityException,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const initialValues = getInitialValues(props);
  const isPublished = listing?.id && listing?.attributes?.state !== LISTING_STATE_DRAFT;
  const unitType = listing?.attributes?.publicData?.unitType;
  // const useFullDays = isFullDay(unitType);

  // adapted from EditListingAvailabilityPanel.js
  const handleSubmit = formData => {
    const { exceptionRange } = formData;

    const range =
      {
        start: exceptionRange?.startDate,
        end: exceptionRange?.endDate,
      };

    const seats = 1;

    // add availability range as an exception
    const availabilityExceptionParams = {
      listingId: listing.id,
      seats,
      ...range,
    };

    // set an availability plan with no availability
    const availabilityValues = {
      availabilityPlan: {
        type: 'availability-plan/time',
        timezone: getDefaultTimeZoneOnBrowser(),
        entries: []
      },
    };
    
    const deleteException = exception => {
      const { id } = exception;
      return onDeleteAvailabilityException({ id });
    };

    onSubmit(availabilityValues)
      .then(() => Promise.all(allExceptions.map(deleteException)))
      .then(() => onAddAvailabilityException(availabilityExceptionParams))
  };

  return (
    <div className={classes}>
      <H3 as="h1">
        {isPublished ? (
          <FormattedMessage
            id="EditListingCustomAvailabilityPanel.title"
            values={{ listingTitle: <ListingLink listing={listing} />, lineBreak: <br /> }}
          />
        ) : (
          <FormattedMessage
            id="EditListingCustomAvailabilityPanel.createListingTitle"
            values={{ lineBreak: <br /> }}
          />
        )}
      </H3>
      <EditListingCustomAvailabilityForm
        className={css.form}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        unitType={unitType}
        saveActionMsg={submitButtonText}
        disabled={disabled}
        ready={ready}
        timeZone={getDefaultTimeZoneOnBrowser()}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
      />
    </div>
  );
};

const { func, object, string, bool } = PropTypes;

EditListingCustomAvailabilityPanel.defaultProps = {
  className: null,
  rootClassName: null,
  listing: null,
};

EditListingCustomAvailabilityPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingCustomAvailabilityPanel;
