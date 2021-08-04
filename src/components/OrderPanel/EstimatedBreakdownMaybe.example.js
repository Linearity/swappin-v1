import Decimal from 'decimal.js';

import config from '../../config';
import { types as sdkTypes } from '../../util/sdkLoader';
import { LINE_ITEM_DAY, LINE_ITEM_NIGHT, LINE_ITEM_UNITS } from '../../util/types';

import EstimatedBreakdownMaybe from './EstimatedBreakdownMaybe';

const { Money } = sdkTypes;
const CURRENCY = config.currency;

export const Empty = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_DAY,
  },
  group: 'payment',
};

export const BookingSingleDay = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_DAY,
    breakdownData: {
      startDate: new Date(Date.UTC(2017, 3, 14)),
      endDate: new Date(Date.UTC(2017, 3, 15)),
    },
    lineItems: [
      {
        code: 'line-item/day',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(1),
        unitPrice: new Money(4500, CURRENCY),
        lineTotal: new Money(4500, CURRENCY),
        reversal: false,
      },
    ],
  },
  group: 'payment',
};

export const BookingMultipleNights = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_NIGHT,
    breakdownData: {
      startDate: new Date(Date.UTC(2017, 3, 14)),
      endDate: new Date(Date.UTC(2017, 3, 16)),
    },
    lineItems: [
      {
        code: 'line-item/night',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(2),
        unitPrice: new Money(4500, CURRENCY),
        lineTotal: new Money(9000, CURRENCY),
        reversal: false,
      },
    ],
  },
  group: 'payment',
};

export const BookingUnits = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_UNITS,
    breakdownData: {
      startDate: new Date(Date.UTC(2017, 3, 14)),
      endDate: new Date(Date.UTC(2017, 3, 16)),
    },
    lineItems: [
      {
        code: 'line-item/units',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(2),
        unitPrice: new Money(4500, CURRENCY),
        lineTotal: new Money(9000, CURRENCY),
        reversal: false,
      },
    ],
  },
  group: 'payment',
};

export const NoBookingWithShipping = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_UNITS,
    breakdownData: {},
    lineItems: [
      {
        code: 'line-item/units',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(2),
        unitPrice: new Money(4500, CURRENCY),
        lineTotal: new Money(9000, CURRENCY),
        reversal: false,
      },
      {
        code: 'line-item/shipping-fee',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(1),
        unitPrice: new Money(1000, CURRENCY),
        lineTotal: new Money(1000, CURRENCY),
        reversal: false,
      },
    ],
  },
  group: 'payment',
};

export const NoBookingWithPickup = {
  component: EstimatedBreakdownMaybe,
  props: {
    unitType: LINE_ITEM_UNITS,
    breakdownData: {},
    lineItems: [
      {
        code: 'line-item/units',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(2),
        unitPrice: new Money(4500, CURRENCY),
        lineTotal: new Money(9000, CURRENCY),
        reversal: false,
      },
      {
        code: 'line-item/pickup-fee',
        includeFor: ['customer', 'provider'],
        quantity: new Decimal(1),
        unitPrice: new Money(0, CURRENCY),
        lineTotal: new Money(0, CURRENCY),
        reversal: false,
      },
    ],
  },
  group: 'payment',
};
