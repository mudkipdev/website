---
date: 2025-08-24
title: Benefits of NixOS
description: if you see this, it wasn't meant to be published
---
## the parts
- nix language
- nix package manager
- nix operating system
- home manager: you kinda need it

## advantages
- config as code
    - It just makes so much sense
    - being able to visualize it
    - "self documenting system": i like this term
- ephemeral root partition: **whitelist** to keep track of installed programs and files
- nix shells: don't install a bunch of crap for compiling random crap
    - "I don't have any build tools installed on my system, only per-project"
- choose rolling release or stability
- `nix run` and `nix shell` commands are super convenient for quick testing (separate from `shell.nix` files)
- immutability, reproducibility: WHATEVER, who cares

## disadvantages
- learning curve (terminology, nix language, commands)
    - It's not hard, just a different paradigm
- need to package crap (programs usually need patches to run due to bad assumptions) (talk about personal experience)
- small community (related to above), bad docs (getting better?)
- it kind of infects everything with its nix files
- systemd

## talk about the technical stuff
- what is a derivation, inputs, outputs
- It's not just a config file, it's a programming language
- let's go over how to package a simple nixos project
- add an example of nixos code
- demystify it

## more
- does it actually even matter?
- you can actually run it with mac or other distros (nix-darwin, os vs package manager.)