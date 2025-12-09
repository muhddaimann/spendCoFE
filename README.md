# SpendCo

SpendCo helps you plan each month and see where every ringgit goes—before it’s gone

## Author

- [@muhddaimann](https://www.github.com/muhddaimann)

## Tech

- Expo React Native (TypeScript)
- React Navigation / Expo Router
- React Native Paper (MD3)

```bash

SpendCo – personal monthly budget & spending companion
├─ About
│ ├─ Mission — Make monthly spending clear, simple, and in control.
│ ├─ Problem — People set budgets, but can’t see where money actually goes.
│ ├─ Outcome — Less “end of month panic”, more intentional spending.
│ ├─ Positioning — Light-weight, monthly-first money overview (not a full bank app).
├─ User Persona
│ ├─ Primary — Young working adult managing salary month-to-month.
│ ├─ Secondary — Fresh grads, interns, first-jobbers learning to budget.
│ ├─ Tertiary — Couples / housemates tracking shared monthly expenses.
│ ├─ Pain
│ │ ├─ “I don’t know where my money went.”
│ │ ├─ Budget only lives in Notes/Excel, hard to maintain.
│ │ ├─ End of month always short / need to top up from savings.
│ ├─ Goal
│ │ ├─ See all spending vs budget in one glance.
│ │ ├─ Keep essentials safe, control impulse buys.
│ │ ├─ Build a simple habit they can actually stick to.
├─ Core Jobs-to-be-Done
│ ├─ Plan — Set a monthly budget and split by simple categories.
│ ├─ Track — Log daily/weekly spending quickly (no complex form).
│ ├─ Watch — See remaining balance by month & category in real time.
│ ├─ Reflect — End-of-month summary: where did most money go?
├─ Core Features
│ ├─ Monthly Budget
│ │ ├─ Set total monthly cap.
│ │ ├─ Allocate to categories (Food, Transport, Bills, Fun, etc.).
│ ├─ Spend Tracking
│ │ ├─ Quick add expense (amount + category + optional note).
│ │ ├─ Today / This week / This month view.
│ ├─ Insights
│ │ ├─ Progress bar for each category (used vs budget).
│ │ ├─ Simple charts (top 3 categories, daily spend trend).
│ │ ├─ “Warning” when close to limit.
│ ├─ Quality-of-life
│ │ ├─ Default categories but editable.
│ │ ├─ Duplicate last expense (for recurring spend).
│ │ ├─ Light/dark mode for daily use.
├─ Non-Goals (for now)
│ ├─ No splitting bills / fronts / reimbursements (that’s Klek-type app).
│ ├─ No investment/loan tracking.
│ ├─ 

spendCo/
├─ app/
│  ├─ (modals)/
│  │  ├─ _layout.tsx
│  │  ├─ addCategory.tsx
│  │  ├─ forgot.tsx
│  │  ├─ signIn.tsx
│  │  └─ signUp.tsx
│  ├─ (tabs)/
│  │  ├─ a/
│  │  │  ├─ _layout.tsx
│  │  │  ├─ addBudget.tsx
│  │  │  ├─ addSpending.tsx
│  │  │  ├─ budgetPage.tsx
│  │  │  ├─ categoryPage.tsx
│  │  │  ├─ index.tsx
│  │  │  └─ spendingPage.tsx
│  │  ├─ b/
│  │  │  ├─ _layout.tsx
│  │  │  └─ index.tsx
│  │  └─ _layout.tsx
│  ├─ _layout.tsx
│  ├─ goodbye.tsx
│  ├─ index.tsx
│  └─ welcome.tsx
├─ assets/
├─ components/
│  ├─ atom/
│  │  ├─ button.tsx
│  │  └─ text.tsx
│  ├─ molecule/
│  │  ├─ alert.tsx
│  │  ├─ confirm.tsx
│  │  ├─ fab.tsx
│  │  ├─ modal.tsx
│  │  ├─ options.tsx
│  │  └─ toast.tsx
│  └─ shared/
│     ├─ header.tsx
│     ├─ homeHeader.tsx
│     └─ navBar.tsx
├─ constants/
│  ├─ design.ts
│  └─ theme.ts
├─ contexts/
│  ├─ api/
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  ├─ categories.ts
│  │  ├─ transactions.ts
│  │  └─ user.ts
│  ├─ authContext.tsx
│  ├─ designContext.tsx
│  ├─ overlayContext.tsx
│  ├─ tabContext.tsx
│  ├─ themeContext.tsx
│  └─ tokenStorage.tsx
├─ hooks/
│  ├─ useCategory.tsx
│  ├─ useGreeting.tsx
│  └─ useOverlay.tsx
├─ .gitignore
├─ app.json
├─ package-lock.json
├─ package.json
├─ README.md
└─ tsconfig.json


```

