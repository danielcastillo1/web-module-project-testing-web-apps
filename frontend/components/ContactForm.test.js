import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm/>);
});

test('renders the contact form header', () => {
    render(<ContactForm/>);

    const headerElement = screen.queryByText(/contact form/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
    
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    userEvent.type(firstName, "123");

    const errorMsg = await screen.findAllByTestId("error");
    expect(errorMsg).toHaveLength(1); 
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

     await waitFor(()=> {
        const errorMsg = screen.queryAllByTestId("error");
        expect(errorMsg).toHaveLength(3);
     });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, "daniel");

    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, "castillo");

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    const errorMsg = await screen.findAllByTestId("error");
    expect(errorMsg).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, "daniel@gmail");

    const errorMsg = await screen.findByText(/email must be a valid email address/i);
    expect(errorMsg).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const submitBtn = screen.getByRole("button");
    userEvent.click(submitBtn);

    const errorMsg = await screen.findByText(/lastName is a required field/i);
    expect(errorMsg).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);

    userEvent.type(firstName, "daniel");
    userEvent.type(lastName, "castillo");
    userEvent.type(email, "daniel@gmail.com");

    const btn = screen.getByRole("button");
    userEvent.click(btn);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText("daniel");
        const lastNameDisplay = screen.queryByText("castillo");
        const emailDisplay = screen.queryByText("daniel@gmail.com");
        const msgDisplay = screen.queryByTestId("messageDisplay");

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(msgDisplay).not.toBeInTheDocument();
    });

});

test('renders all fields text when all fields are submitted.', async () => {

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const msgField = screen.getByLabelText(/message/i);


    userEvent.type(firstName, "alejandro");
    userEvent.type(lastName, "cervantes");
    userEvent.type(email, "ale@gmail.com");
    userEvent.type(msgField, "message");


    const btn = screen.getByRole("button");
    userEvent.click(btn);

    await waitFor(()=> {
        const firstNameDisplay = screen.queryByText(/alejandro/i);
        const lastNameDisplay = screen.queryByText(/cervantes/i);
        const emailDisplay = screen.queryByText(/ale@gmail.com/i);
        const msgDisplay = screen.queryByText(/message/i);

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(msgDisplay).toBeInTheDocument();
    });
});
