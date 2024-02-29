#create a rock paper scissors game
import random
import sys

def main():
    print("Welcome to Rock, Paper, Scissors!")
    print("Please enter your choice: ")
    print("Rock, Paper, or Scissors")
    print("To exit the game, type 'exit'")
    user_input = input("Your choice: ")
    user_input = user_input.lower()
    if user_input == "exit":
        sys.exit()
    if user_input != "rock" and user_input != "paper" and user_input != "scissors":
        print("Invalid input. Please try again.")
        main()
    else:
        computer_choice = random.choice(["rock", "paper", "scissors"])
        print("The computer chose: " + computer_choice)
        if user_input == computer_choice:
            print("It's a tie!")
        elif user_input == "rock":
            if computer_choice == "scissors":
                print("You win!")
            else:
                print("You lose!")
        elif user_input == "paper":
            if computer_choice == "rock":
                print("You win!")
            else:
                print("You lose!")
        elif user_input == "scissors":
            if computer_choice == "paper":
                print("You win!")
            else:
                print("You lose!")
        main()

main()