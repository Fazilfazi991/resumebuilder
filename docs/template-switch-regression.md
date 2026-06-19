# Template Switch Regression Checklist

Core rule: resume content is permanent, template id is only the visual skin.

Manual checks:

1. Open `/builder/guest`.
2. Fill full name, email, summary, one experience item, and skills.
3. Open Change Template.
4. Select a different template.
5. Confirm all fields remain filled and only the preview design changes.
6. Select another template.
7. Refresh the page.
8. Confirm fields, title, section order, active editing flow, and selected template remain.
9. Repeat on mobile width around 390px.
10. Repeat on a logged-in saved resume.
11. Open `/templates` with an existing guest draft and click Use Template.
12. Confirm Apply to current draft preserves details and changes only the template.
13. Confirm Start new resume is the only action that clears the draft.
14. Download PDF and confirm the selected template is used with the preserved content.
