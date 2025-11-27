import { render, screen, fireEvent } from "@testing-library/react";
import MenuItem from "./MenuItem";
import { describe, vi } from "vitest";
import { useNavigate } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("Tenstando MenuItem", () => {
    
} )


