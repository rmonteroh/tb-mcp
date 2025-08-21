export const filtersAvailableContext = `
= Equal
!= NOT equal
> Greater than
>= Greater than or equal
< Less than
<= Less than or equal
~ Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
!~ NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
?= Any/At least one of Equal
?!= Any/At least one of NOT equal
?> Any/At least one of Greater than
?>= Any/At least one of Greater than or equal
?< Any/At least one of Less than
?<= Any/At least one of Less than or equal
?~ Any/At least one of Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
?!~ Any/At least one of NOT Like/Contains (if not specified auto wraps the right string OPERAND in a "%" for wildcard match)
`;
