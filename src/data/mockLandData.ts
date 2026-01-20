
export interface LandData {
    id: string; // Changed to string to match URL params usually
    landId: string;
    name: string;
    location: string;
    surveyNumber: string;
    village: string;
    hobli: string;
    mandal: string;
    district: string;
    state: string;
    country: string;
    pricePerSqFt: string;
    fullAddress: string;
    totalValue: string;
    tokenPrice: string;
    minTokens: number;
    maxTokens: number;
    availableTokens: number;
    totalTokens: number;
    lockIn: string;
    expectedROI: string;
    area: string;
    description: string;
    features: string[];
    documents: {
        name: string;
        verified: boolean;
        size: string;
        type: string;
        downloadUrl: string;
    }[];
    galleryImages: string[];
    litigations: string;
    landOwner: {
        name: string;
        type: string;
        contactPerson: string;
        verified: boolean;
    };
    exitConditions: string[];
    images: string[];
    investors: number;
}

const baseLandData: Omit<LandData, "id" | "landId" | "name"> = {
    location: "Whitefield, Bangalore",
    surveyNumber: "45/2",
    village: "Varthur",
    hobli: "Varthur",
    mandal: "Bangalore East",
    district: "Bangalore Urban",
    state: "Karnataka",
    country: "India",
    pricePerSqFt: "₹4,500",
    fullAddress: "Survey No. 45/2, Green Valley Township, Whitefield, Bangalore - 560066",
    totalValue: "₹50,00,000",
    tokenPrice: "₹25,000",
    minTokens: 1,
    maxTokens: 10,
    availableTokens: 150,
    totalTokens: 200,
    lockIn: "18 months",
    expectedROI: "12-15%",
    area: "2.5 Acres",
    description: "Prime residential land located in the rapidly developing Whitefield area. Government verified and blockchain registered. Ideal for residential development with excellent connectivity to IT hubs.",
    features: [
        "Government Verified",
        "Blockchain Registered",
        "Clear Title",
        "Road Access",
        "Water Connection",
        "Electricity Available"
    ],
    documents: [
        { name: "Title Deed", verified: true, size: "2.4 MB", type: "PDF", downloadUrl: "#" },
        { name: "Land Survey Report", verified: true, size: "1.8 MB", type: "PDF", downloadUrl: "#" },
        { name: "Encumbrance Certificate", verified: true, size: "1.1 MB", type: "PDF", downloadUrl: "#" },
        { name: "Tax Receipts (2023-24)", verified: true, size: "0.5 MB", type: "PDF", downloadUrl: "#" },
        { name: "Legal Opinion", verified: true, size: "3.2 MB", type: "PDF", downloadUrl: "#" },
    ],
    galleryImages: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&h=500&fit=crop",
    ],
    litigations: "No active litigations. The land has a clear market title with no encumbrances for the last 30 years.",
    landOwner: {
        name: "Rajesh Kumar Holdings LLP",
        type: "Private Limited Liability Partnership",
        contactPerson: "Mr. Suresh Reddy",
        verified: true,
    },
    exitConditions: [
        "Minimum lock-in period of 18 months before any exit request.",
        "Exit window opens once every quarter, subject to buyer availability.",
        "Exit price will be based on latest government guidance value and platform valuation.",
        "Platform fee of 1.5% will be charged on the exit amount.",
    ],
    images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop",
        "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&h=500&fit=crop",
    ],
    investors: 50,
};

export const getLandData = (id: string | undefined): LandData => {
    const numericId = parseInt(id || "1", 10);

    return {
        ...baseLandData,
        id: id || "1",
        landId: `LND-2024-00${id}`,
        name: `Green Valley Plot A${10 + numericId}`, // e.g., A11, A12
    };
};

export interface LandPiece {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    available: boolean;
    owner?: string;
    price: number;
}

export const generateLandPieces = (landId: string = "1"): LandPiece[] => {
    const pieces: LandPiece[] = [];
    const gridSize = 10;
    const pieceSize = 100 / gridSize; // Percentage

    // Simple pseudo-random seed based on landId to make it deterministic but different per land
    const seed = parseInt(landId, 10) || 1;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const id = row * gridSize + col + 1;

            // Use seed in the math to vary availability per land
            const isSold = ((id * seed * 123) + (row * 7) + col) % 10 > 7;
            const available = !isSold;

            pieces.push({
                id,
                x: col * pieceSize,
                y: row * pieceSize,
                width: pieceSize,
                height: pieceSize,
                available,
                price: 25000,
            });
        }
    }
    return pieces;
};
