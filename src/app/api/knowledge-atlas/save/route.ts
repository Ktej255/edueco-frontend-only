import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define paths to data files
const DATA_DIR = path.join(process.cwd(), 'public/data/knowledge-map');
const NODES_FILE = path.join(DATA_DIR, 'nodes.json');
const EDGES_FILE = path.join(DATA_DIR, 'edges.json');

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nodes: newPositions, bendPoints: newBendPoints, sizes: newSizes } = body;

        // 1. Read existing data
        const [nodesData, edgesData] = await Promise.all([
            fs.readFile(NODES_FILE, 'utf-8').then(JSON.parse),
            fs.readFile(EDGES_FILE, 'utf-8').then(JSON.parse)
        ]);

        // 2. Update nodes with new positions and sizes
        const updatedNodes = nodesData.map((node: any) => {
            const updates: any = {};

            // Update position if exists in payload
            if (newPositions && newPositions[node.id]) {
                updates.x = newPositions[node.id].x;
                updates.y = newPositions[node.id].y;
            }

            // Update size if exists in payload
            if (newSizes && newSizes[node.id]) {
                // Determine width/height based on size (keeping aspect ratio or just size)
                // For this implementation, we'll store a 'size' property which the frontend uses
                // Or map it to width/height if the data structure expects that
                updates.size = "custom"; // Mark as custom size
                updates.customSize = newSizes[node.id];
            }

            return { ...node, ...updates };
        });

        // 3. Update edges with new bend points
        const updatedEdges = edgesData.map((edge: any) => {
            const edgeKey = `${edge.source}-${edge.target}`; // Ensure this matches frontend key generation

            if (newBendPoints && newBendPoints[edgeKey]) {
                return { ...edge, bendPoints: newBendPoints[edgeKey] };
            }
            return edge;
        });

        // 4. Write back to files
        await Promise.all([
            fs.writeFile(NODES_FILE, JSON.stringify(updatedNodes, null, 2)),
            fs.writeFile(EDGES_FILE, JSON.stringify(updatedEdges, null, 2))
        ]);

        return NextResponse.json({ success: true, message: 'Layout saved successfully' });
    } catch (error) {
        console.error('Error saving knowledge graph data:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save layout' },
            { status: 500 }
        );
    }
}
