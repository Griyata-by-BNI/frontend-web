import { test, expect } from '@playwright/test';

// Komponen test untuk menggunakan hook
const TestComponent = `
import React from 'react';
import { useKPRCalculation } from './hooks/useKPRCalculation';
import { InterestRate } from './_types';

interface TestComponentProps {
  propertyPrice: number;
  downPayment: number;
  tenor: number;
  selectedRate: InterestRate | null;
}

export const TestComponent: React.FC<TestComponentProps> = ({
  propertyPrice,
  downPayment,
  tenor,
  selectedRate
}) => {
  const { monthlyPayment, paymentSchedule, isValidTenor } = useKPRCalculation({
    propertyPrice,
    downPayment,
    tenor,
    selectedRate
  });

  return (
    <div>
      <div data-testid="monthly-payment">{monthlyPayment.toFixed(2)}</div>
      <div data-testid="is-valid-tenor">{isValidTenor.toString()}</div>
      <div data-testid="payment-schedule-length">{paymentSchedule.length}</div>
      {paymentSchedule.map((item, index) => (
        <div key={index}>
          <div data-testid={\`schedule-period-\${index}\`}>{item.period}</div>
          <div data-testid={\`schedule-rate-\${index}\`}>{item.rate}</div>
          <div data-testid={\`schedule-payment-\${index}\`}>{item.monthlyPayment.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
};
`;

test.describe('useKPRCalculation Hook Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup halaman test dengan React component
    await page.goto('/test-kpr-calculator');
  });

  test.describe('Single Fixed Rate Calculations', () => {
    test('should calculate correct monthly payment for valid single-fixed rate', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000, // 1 miliar
        downPayment: 200000000,    // 200 juta
        tenor: 15,                 // 15 tahun
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 8.5,       // 8.5%
          minimum_tenor: 5
        }
      };

      // Set test data
      await page.evaluate((data) => {
        window.testData = data;
      }, testData);

      // Trigger re-render dengan data baru
      await page.reload();

      // Verify monthly payment calculation
      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      const isValidTenor = await page.textContent('[data-testid="is-valid-tenor"]');
      
      // Expected calculation: 800M loan, 8.5% annual rate, 15 years
      // Monthly rate = 8.5/100/12 = 0.007083
      // Total months = 15 * 12 = 180
      // Expected monthly payment ≈ 7,867,816
      expect(parseFloat(monthlyPayment || '0')).toBeGreaterThan(7800000);
      expect(parseFloat(monthlyPayment || '0')).toBeLessThan(7900000);
      expect(isValidTenor).toBe('true');
    });

    test('should return zero for invalid tenor (below minimum)', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 200000000,
        tenor: 3, // Below minimum tenor of 5
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 8.5,
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      const isValidTenor = await page.textContent('[data-testid="is-valid-tenor"]');
      
      expect(monthlyPayment).toBe('0.00');
      expect(isValidTenor).toBe('false');
    });

    test('should return zero when down payment equals property price', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 1000000000, // Same as property price
        tenor: 15,
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 8.5,
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      expect(monthlyPayment).toBe('0.00');
    });
  });

  test.describe('Tiered Fixed Rate Calculations', () => {
    test('should calculate payment schedule for tiered-fixed rate', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 200000000,
        tenor: 15,
        selectedRate: {
          type: 'tiered-fixed',
          interest_rate: [
            { rate: 7.5, note: 'Year 1-2' },
            { rate: 8.0, note: 'Year 3-5' },
            { rate: 8.5, note: 'Year 6-15' }
          ],
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      // Verify payment schedule is generated
      const scheduleLength = await page.textContent('[data-testid="payment-schedule-length"]');
      expect(scheduleLength).toBe('3');

      // Verify first tier
      const period0 = await page.textContent('[data-testid="schedule-period-0"]');
      const rate0 = await page.textContent('[data-testid="schedule-rate-0"]');
      expect(period0).toBe('Year 1-2');
      expect(rate0).toBe('7.5%');

      // Verify second tier
      const period1 = await page.textContent('[data-testid="schedule-period-1"]');
      const rate1 = await page.textContent('[data-testid="schedule-rate-1"]');
      expect(period1).toBe('Year 3-5');
      expect(rate1).toBe('8.0%');

      // Verify third tier
      const period2 = await page.textContent('[data-testid="schedule-period-2"]');
      const rate2 = await page.textContent('[data-testid="schedule-rate-2"]');
      expect(period2).toBe('Year 6-15');
      expect(rate2).toBe('8.5%');

      // Monthly payment should be 0 for tiered rates
      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      expect(monthlyPayment).toBe('0.00');
    });

    test('should handle malformed tiered rate data gracefully', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 200000000,
        tenor: 15,
        selectedRate: {
          type: 'tiered-fixed',
          interest_rate: 'invalid data', // Invalid format
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      const scheduleLength = await page.textContent('[data-testid="payment-schedule-length"]');
      
      expect(monthlyPayment).toBe('0.00');
      expect(scheduleLength).toBe('0');
    });
  });

  test.describe('Edge Cases and Validation', () => {
    test('should return zero for null selectedRate', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 200000000,
        tenor: 15,
        selectedRate: null
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      const isValidTenor = await page.textContent('[data-testid="is-valid-tenor"]');
      
      expect(monthlyPayment).toBe('0.00');
      expect(isValidTenor).toBe('true'); // Should be true when selectedRate is null
    });

    test('should return zero for zero property price', async ({ page }) => {
      const testData = {
        propertyPrice: 0,
        downPayment: 200000000,
        tenor: 15,
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 8.5,
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      expect(monthlyPayment).toBe('0.00');
    });

    test('should return zero for zero down payment resulting in full loan', async ({ page }) => {
      const testData = {
        propertyPrice: 1000000000,
        downPayment: 0,
        tenor: 15,
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 8.5,
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      // Should calculate for full loan amount
      expect(parseFloat(monthlyPayment || '0')).toBeGreaterThan(9000000);
    });

    test('should update calculations when parameters change', async ({ page }) => {
      // Initial data
      let testData = {
        propertyPrice: 500000000,
        downPayment: 100000000,
        tenor: 10,
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 7.5,
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const initialPayment = await page.textContent('[data-testid="monthly-payment"]');
      
      // Update data
      testData = {
        ...testData,
        propertyPrice: 800000000, // Increase property price
        downPayment: 200000000    // Increase down payment
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const updatedPayment = await page.textContent('[data-testid="monthly-payment"]');
      
      // Payment should be different after parameter change
      expect(initialPayment).not.toBe(updatedPayment);
      expect(parseFloat(updatedPayment || '0')).toBeGreaterThan(0);
    });
  });

  test.describe('Mathematical Accuracy', () => {
    test('should calculate mathematically correct monthly payment', async ({ page }) => {
      const testData = {
        propertyPrice: 500000000,  // 500M
        downPayment: 100000000,   // 100M  
        tenor: 10,                // 10 years
        selectedRate: {
          type: 'single-fixed',
          interest_rate: 6.0,     // 6% annual
          minimum_tenor: 5
        }
      };

      await page.evaluate((data) => {
        window.testData = data;
      }, testData);
      await page.reload();

      const monthlyPayment = await page.textContent('[data-testid="monthly-payment"]');
      
      // Manual calculation:
      // Loan amount = 500M - 100M = 400M
      // Monthly rate = 6% / 12 = 0.5% = 0.005
      // Total months = 10 * 12 = 120
      // PMT = 400M * 0.005 * (1.005^120) / ((1.005^120) - 1)
      // PMT ≈ 4,442,006
      
      const payment = parseFloat(monthlyPayment || '0');
      expect(payment).toBeGreaterThan(4400000);
      expect(payment).toBeLessThan(4500000);
    });
  });
});

// Helper untuk setup test environment
test.describe('Test Environment Setup', () => {
  test('should setup test component correctly', async ({ page }) => {
    // Verifikasi bahwa komponen test dapat di-mount
    await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
    await expect(page.locator('[data-testid="is-valid-tenor"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-schedule-length"]')).toBeVisible();
  });
});